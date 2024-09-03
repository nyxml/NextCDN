document.getElementById('fileInput').addEventListener('change', async (event) => {
    const logContainer = document.getElementById('log');
    const files = event.target.files;

    if (files.length === 0) {
        return;
    }

    const now = new Date().toLocaleString();
    const fileNames = Array.from(files).map(file => file.name).join(', ');

    // Update log on the page
    logContainer.innerHTML += `<p><strong>${now}</strong>: Files uploaded - ${fileNames}</p>`;
    logContainer.scrollTop = logContainer.scrollHeight;

    // Prepare the log message
    const message = {
        content: `**${now}**: Files uploaded - ${fileNames}`
    };

    // Replace 'YOUR_WEBHOOK_URL' with your actual Discord webhook URL
    const webhookUrl = 'YOUR_WEBHOOK_URL';

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
    } catch (error) {
        console.error('Error sending log to Discord:', error);
    }
});
