const keySize = 16; // Key size in bytes
const ivSize = 12; // IV size in bytes

async function generateKey() {
    return crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

async function encryptFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a file first.');
        return;
    }

    const file = fileInput.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const key = await generateKey();
    const iv = crypto.getRandomValues(new Uint8Array(ivSize));

    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        arrayBuffer
    );

    const encryptedBlob = new Blob([iv, new Uint8Array(encryptedBuffer)], { type: 'application/octet-stream' });
    const encryptedUrl = URL.createObjectURL(encryptedBlob);

    const link = document.createElement('a');
    link.href = encryptedUrl;
    link.download = `encrypted_${file.name}`;
    link.click();
}

async function decryptFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a file first.');
        return;
    }

    const file = fileInput.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const iv = arrayBuffer.slice(0, ivSize);
    const encryptedData = arrayBuffer.slice(ivSize);

    const key = await generateKey(); // In practice, use a previously saved key

    try {
        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            encryptedData
        );

        const decryptedBlob = new Blob([decryptedBuffer], { type: 'application/octet-stream' });
        const decryptedUrl = URL.createObjectURL(decryptedBlob);

        const link = document.createElement('a');
        link.href = decryptedUrl;
        link.download = `decrypted_${file.name}`;
        link.click();
    } catch (e) {
        alert('Decryption failed.');
    }
}
