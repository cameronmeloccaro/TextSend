

const firebaseConfig = {
  apiKey: "AIzaSyCctBfFMNlqoaFEdgnQHz4LVuzXQmYTf5s",
  authDomain: "textsend-75f8e.firebaseapp.com",
  projectId: "textsend-75f8e",
  storageBucket: "textsend-75f8e.firebasestorage.app",
  messagingSenderId: "114221481252",
  appId: "1:114221481252:web:4923b4619ef74544be07b1",
  measurementId: "G-ZJQ5MVHRCV"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const uploadBtn = document.getElementById("sendBtn");
const uploadField = document.getElementById("uploadText");
const outputBox = document.getElementById("shareCodeText")
const viewBtn = document.getElementById("recieveBtn")
const scriptCodeField = document.getElementById("codeField")
const outputViewBox = document.getElementById("outputView")
const viewCodeBox = document.getElementById("viewCode")
const copyBtn = document.getElementById("copyBtn")

const max_length = 20000
const makeId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};


uploadBtn.addEventListener("click", async () => {
    const text = uploadField.value;
    console.log(text)

    if (!text.trim()) {
        outputBox.textContent = "Please paste a script first";
        return;
    }
    if (text.length > max_length) {
        outputBox.textContent = "Script is too large";
        return;
    }
    uploadBtn.disabled = true;
    outputBox.textContent = "Saving...";
    try {
        let newId;
        while (true) {
            newId = makeId();
            const doc = await db.collection("scripts").doc(newId).get();
            if (!doc.exists) break;
        }
        await db.collection("scripts").doc(newId).set({
            newId: newId,
            code: text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        outputBox.textContent = `Code: ${newId}`
    } catch (err) {
        console.log(err);
        outputBox.textContext = "Error saving script";
    } finally {
        uploadBtn.disabled = false;
    }
});

viewBtn.addEventListener("click", async () => {
const id = scriptCodeField.value;
console.log(id)
if (!id) {
    outputViewBox.textContent = "Please enter a share code."
    return;
}
viewBtn.disabled = true;
outputViewBox.textContent = "Loading..."

try {
    const doc = await db.collection("scripts").doc(id).get();
    if (!doc.exists) {
        outputViewBox.textContent = "No script found"
        return;
    }
    const data = doc.data();
    viewCodeBox.textContent = data.code || "";
    outputViewBox.textContent = "Loaded"
    
} catch (err) {
    console.error(err);
    outputViewBox.textContent = "Error loading script"
} finally {
    viewBtn.disabled = false
    
}

});

copyBtn.addEventListener("click", async () => {
    navigator.clipboard.writeText(viewCodeBox.textContent);
    copyBtn.textContent = "Copied"

    setTimeout(() => {
        copyBtn.textContent = "Copy"
    }, 2000);
});

