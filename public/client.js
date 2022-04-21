/*
refreshMsg();
viewSection('intro');
*/

/* encryption */

let pem = localStorage.getItem("pem");
function getKeyPair() {
    // generer et sauvegarder la clef privee en format PEM dans localStorage
    let keyPair, privateKey, publicKey
    if (pem) {
        privateKey = forge.pki.privateKeyFromPem(pem);
        publicKey = forge.pki.setRsaPublicKey(privateKey.n, privateKey.e);
        keyPair = {privateKey, publicKey};
    } else {
        keyPair = forge.pki.rsa.generateKeyPair({bits: 1024});
        localStorage.setItem("pem", forge.pki.privateKeyToPem(keyPair.privateKey));
    };
    return keyPair;
};
let keyPair = getKeyPair();
let publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
document.getElementById("publicKey").innerHTML = publicKeyPem;

function viewSection(sectionID) {
    let sections = document.getElementsByClassName("nav-section");

    for (let i = 0; i < sections.length; i++) {
        if (sections[i].id == sectionID && sections[i].classList.contains("hidden")) {
            sections[i].classList.remove("hidden");
        }
        if (sections[i].id !== sectionID && !sections[i].classList.contains("hidden")) {
            sections[i].classList.add("hidden");
        }
    }
}

/*use this later
let btnEncrypt = document.getElementById('encrypt');
let btnDecrypt = document.getElementById('decrypt');

btnEncrypt.addEventListener("click", event => {
    let msg = document.getElementById("msg").value;
    try {
        document.querySelector(".result").innerText =
        forge.util.encode64( keyPair.publicKey.encrypt(forge.util.encodeUtf8(msg)));
    } catch (err) {
        document.querySelector(".result").innerText = err;
    };
});

btnDecrypt.addEventListener("click", event => {
    let msg = document.getElementById("msg").value;
    try {
        document.querySelector(".result").innerText =
        forge.util.decodeUtf8( keyPair.privateKey.decrypt(forge.util.decode64(msg)));
    } catch (err) {
        document.querySelector(".result").innerText = err;
    };
});
*/

/* contacts */

let arrayContacts = [];
let counterContacts;

//get data from localstorage or create if not exists
//turn into falsey statement?
if (localStorage.getItem("counterContacts") == null) {
    counterContacts = 0;
    localStorage.setItem("counterContacts", counterContacts);
} else {
    counterContacts = localStorage.getItem("counterContacts");
}

if (localStorage.getItem("arrayContacts") == "" || localStorage.getItem("arrayContacts") == null) {
    localStorage.setItem("arrayContacts", arrayContacts);
} else {
    arrayContacts = JSON.parse(localStorage.getItem("arrayContacts"));
}

//refresh views after retrieving from localstorage
refreshContacts();
refreshMsgContacts();

function saveContact() {
    let frmID = document.getElementById("contactID").value;
    let frmName = document.getElementById("contactName").value;
    let frmPublicKey = document.getElementById("contactPublicKey").value; //document.forms["frmContacts"]["contactPublicKey"].value;

    if (frmName == "" || frmPublicKey == "") {
        alert("Erreur! Saisissez les données.");
    } else {
        let newID;
        if (frmID == "") {
            newID = ++counterContacts;
        } else {
            newID = frmID;
        }
    
        let frmNewContact = {
            "ID": newID,
            "name": frmName,
            "publicKey": frmPublicKey,
            "lastUpdate": new Date()
        };
    
        arrayContactsIndex = getArrayContactsIndexFromID(frmNewContact.ID);
    
        if (arrayContactsIndex == -1) {
            arrayContacts.push(frmNewContact);
        } else {
            arrayContacts[arrayContactsIndex] = frmNewContact;
        }
    
        fillContactForm("", "", "");
    }

    refreshContacts();
    refreshMsgContacts();
}

function getArrayContactsIndexFromID(newContactID) {
    for (var i = 0; i < arrayContacts.length; i++) {
        if (arrayContacts[i].ID == newContactID) {
            return i;
        }
    }
    return -1;
}

function fillContactForm(ID, name, publicKey) {
    let frmContactID = document.getElementById("contactID");
    let frmContactName = document.getElementById("contactName");
    let frmContactPublicKey = document.getElementById("contactPublicKey"); //document.forms["frmContacts"]["contactPublicKey"];

    frmContactID.value = ID;
    frmContactName.value = name;
    frmContactPublicKey.value = publicKey;
}

function addContactTableRow(newContact) {
    var tbodyRef = document.getElementById("tblContacts").getElementsByTagName("tbody")[0];
    var newRow = tbodyRef.insertRow();
    var cellID = newRow.insertCell(0);
    var cellName = newRow.insertCell(1);
    var cellPublicKey = newRow.insertCell(2);
    var cellLastUpdate = newRow.insertCell(3);
    var cellModify = newRow.insertCell(4);

    if (newContact == undefined) {
        cellName.innerHTML = "Aucun record";
    } else {
        cellID.innerHTML = newContact.ID;
        cellName.innerHTML = newContact.name;
        cellPublicKey.innerHTML = newContact.publicKey.replace(/\n/g,"<br>");
    
        //let lastUpdate = Date.parse(lastUpdate);
        let offset = newContact.lastUpdate.getTimezoneOffset();
        let lastUpdate = new Date(newContact.lastUpdate.getTime() - (offset * 60 * 1000));
        cellLastUpdate.innerHTML = lastUpdate.toISOString().replace("T"," ").substring(0,16).replace(":", " h ");

        let btnEdit = document.createElement("input");
        btnEdit.type = "submit";
        //btnEdit.className = "btn";
        btnEdit.value = "Modifier";
        btnEdit.id = "editContact" + newContact.ID;
        btnEdit.classList.add("button-margin");
        //btnEdit.onclick = function() {editContact(newContact.ID);}
        btnEdit.addEventListener("click", function() {
            editContact(newContact.ID);
        })
        cellModify.appendChild(btnEdit);

        let btnDelete = document.createElement("input");
        btnDelete.type = "button";
        //btnDelete.className = "btn";
        btnDelete.value = "Supprimer";
        btnDelete.id = "deleteContact" + newContact.ID;
        btnDelete.classList.add("button-margin");
        //btnDelete.onclick = function() {deleteContact(newContact.ID);}
        btnDelete.addEventListener("click", function() {
            deleteContact(newContact.ID);
        })
        cellModify.appendChild(btnDelete);
    }
}

function refreshContacts(searchCond) {
    let contactsTable = document.getElementById("tblContactsBody");
    contactsTable.innerHTML = "";

    if (arrayContacts.length === 0) {
        addContactTableRow();
    } else {
        for (var i = 0; i < arrayContacts.length; i++) {
            arrayContacts[i].lastUpdate = new Date(arrayContacts[i].lastUpdate);
            if (searchCond == undefined || JSON.stringify(arrayContacts[i]).includes(searchCond)) {
                addContactTableRow(arrayContacts[i]);
            }
        }
    }

    localStorage.setItem("arrayContacts", JSON.stringify(arrayContacts));
    localStorage.setItem("counterContacts", counterContacts);
}

function editContact(contactIDToEdit) {
    let contactToEdit;

    for (let i = 0; i < arrayContacts.length; i++) {
        if (arrayContacts[i].ID == contactIDToEdit) {
            contactToEdit = arrayContacts[i];
            fillContactForm(contactToEdit.ID, contactToEdit.name, contactToEdit.publicKey);
            break;
        }
    }

    refreshContacts();
}

function deleteContact(contactIDToDelete) {
    let contactIndexToDelete;
    for (let i = 0; i < arrayContacts.length; i++) {
        if (arrayContacts[i].ID == contactIDToDelete) {
            contactIndexToDelete = i;
            arrayContacts.splice(contactIndexToDelete);
            break;
        }
    }
    refreshContacts();     
}

function refreshMsgContacts() {
    let msgContact = document.getElementById("msgContact");
    msgContact.innerHTML = "";
    for (let i = -1; i < arrayContacts.length; i++) {
        let opt = document.createElement("option");
        if (i == -1) {
            if (arrayContacts.length === 0) {
                opt.innerText = "Aucun contact";
            } else {
                opt.innerText = "Choisir contact";
            }
            opt.value = "blankrow";
        } else {
            opt.innerText = arrayContacts[i].name;
            opt.value = arrayContacts[i].ID;
            opt.name = arrayContacts[i].name;
        }
        msgContact.appendChild(opt);
    }

}


/* messages */

let arrayMsg = [];
let lettersJSON = {};
let counterMsg;

//turn into falsey statement?
if (localStorage.getItem("counterMsg") !== null) {
    counterMsg = localStorage.getItem("counterMsg");
} else {
    counterMsg = 0;
    localStorage.setItem("counterMsg", counterMsg);
}

if (localStorage.getItem("arrayMsg") == "" || localStorage.getItem("arrayMsg") == null) {
    localStorage.setItem("arrayMsg", arrayMsg);
} else {
    arrayMsg = JSON.parse(localStorage.getItem("arrayMsg"));
}

function sendMsg() {
    let frmMsgContact = document.getElementById("msgContact").value;
    let frmMsgText = document.getElementById("msgText").value;

    if (frmMsgContact == "blankrow") {
        alert("Erreur! Choisissez un contact.");
    } else if (frmMsgText == "") { 
        alert("Erreur! Saisissez le message.");
    } else {
        let frmNewMsg = {
            "ID": ++counterMsg,
            "contactID": frmMsgContact,
            "message": frmMsgText,
            "lastUpdate": new Date()
        };
        arrayMsg.push(frmNewMsg);
        refreshMsg();
    }
}

function refreshMsg(searchCond) {
    let msgTable = document.getElementById("tblMsgBody");
    msgTable.innerHTML = "";

    if (arrayMsg.length === 0) {
        addMsgTableRow();
    } else {
        for (var i = 0; i < arrayMsg.length; i++) {
            arrayMsg[i].lastUpdate = new Date(arrayMsg[i].lastUpdate);
            let msg = arrayMsg[i];
            let msgContact;
            let msgContactIndex = getArrayContactsIndexFromID(arrayMsg[i].contactID);
            if (msgContactIndex == -1) {
                msgContact.name = "";
            }
            let searchMsgAndContact = JSON.stringify(msg) + JSON.stringify(msgContact);
            if (searchCond == undefined || searchMsgAndContact.includes(searchCond)) {
                addMsgTableRow(msg);
            }
        }
    }

    localStorage.setItem("arrayMsg", JSON.stringify(arrayMsg));
    localStorage.setItem("counterMsg", counterMsg);
}

function addMsgTableRow(newMsg) {
    let tbodyRef = document.getElementById("tblMsg").getElementsByTagName("tbody")[0];
    let newRow = tbodyRef.insertRow();
    let cellID = newRow.insertCell(0);
    let cellRecipient = newRow.insertCell(1);
    let cellMessage = newRow.insertCell(2);
    let cellLastUpdate = newRow.insertCell(3);

    //keep this?
    cellMessage.classList.add("tdbreak");

    if (newMsg == undefined) {
        cellMessage.innerHTML = "Aucun message";
    } else {
        let msgContact;
        for (let i = 0; i < arrayContacts.length; i++) {
            if (arrayContacts[i].ID == newMsg.contactID) {
                msgContact = arrayContacts[i];
                break;
            }
        }
        
        if (msgContact == undefined) {
            msgContact.name = "";
        }

        cellID.innerHTML = newMsg.ID;
        cellRecipient.innerHTML = msgContact.name;
        cellMessage.innerHTML = newMsg.message.replace(/\n/g,"<br>");
    
        //let lastUpdate = Date.parse(lastUpdate);
        let offset = newMsg.lastUpdate.getTimezoneOffset();
        let lastUpdate = new Date(newMsg.lastUpdate.getTime() - (offset * 60 * 1000));
        cellLastUpdate.innerHTML = lastUpdate.toISOString().replace("T"," ").substring(0,16).replace(":", " h ");
    }
}