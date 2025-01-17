document.addEventListener('DOMContentLoaded', function () {
    let currentIndex = 0;
    let urls = [];
    let savedLinks = [];
    let brokenLinks = [];

    document.getElementById('redirectForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const input = document.getElementById('urlInput').value;
        urls = input.split('\n').map(url => url.trim()).filter(url => url.length > 0);

        if (urls.length === 0) {
            alert('Please enter at least one URL.');
            return;
        }

        currentIndex = 0;
        updateRemainingLinks(); // Update the remaining links count
        showLinkAndRedirect(currentIndex);
    });

    document.getElementById('nextButton').addEventListener('click', function () {
        showLinkAndRedirect(currentIndex);
    });

    document.getElementById('saveButton').addEventListener('click', function () {
        const currentUrl = document.getElementById('currentLink').innerText;
        if (currentUrl && !savedLinks.includes(currentUrl)) {
            savedLinks.push(currentUrl);
            displayLinks();
        }
    });

    document.getElementById('brokenButton').addEventListener('click', function () {
        const currentUrl = document.getElementById('currentLink').innerText;
        if (currentUrl && !brokenLinks.includes(currentUrl)) {
            brokenLinks.push(currentUrl);
        }
    });

    document.getElementById('downloadButton').addEventListener('click', function () {
        const savedText = savedLinks.join('\n');
        const brokenText = brokenLinks.join('\n');
    
        // Download saved links
        const savedBlob = new Blob([savedText], { type: 'text/plain' });
        const savedLink = document.createElement('a');
        savedLink.href = URL.createObjectURL(savedBlob);
        savedLink.download = 'saved_links.txt';
        savedLink.click();
    
        // Download broken links only if the array is not empty
        if (brokenLinks.length > 0) {
            const brokenBlob = new Blob([brokenText], { type: 'text/plain' });
            const brokenLink = document.createElement('a');
            brokenLink.href = URL.createObjectURL(brokenBlob);
            brokenLink.download = 'broken_links.txt';
            brokenLink.click();
        }
    });
    

    function updateRemainingLinks() {
        const remainingCount = urls.length - currentIndex;
        document.getElementById('remaining').innerText = `Links Remaining: ${remainingCount}`;
    }

    function showLinkAndRedirect(index) {
        if (index < urls.length) {
            const url = urls[index];
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                alert('Invalid URL format, skipping: ' + url);
                currentIndex++;
                updateRemainingLinks(); // Update remaining links count
                showLinkAndRedirect(currentIndex);
                return;
            }

            document.getElementById('currentLink').innerText = url;
            window.open(url, '_blank');
            currentIndex++;
            updateRemainingLinks(); // Update remaining links count
        } else {
            document.getElementById('currentLink').innerText = 'No more links';
            updateRemainingLinks(); // Set remaining count to 0
        }
    }

    function displayLinks() {
        const linkList = document.getElementById('linkList');
        linkList.innerHTML = '';

        savedLinks.forEach(function (url) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.textContent = url;
            listItem.appendChild(link);
            linkList.appendChild(listItem);
        });
    }

    window.addEventListener('beforeunload', function (event) {
        // Most modern browsers require this method to trigger the confirmation dialog
        event.preventDefault(); // Prevent the default action of the event (page unload)
        // 
    });
    
});


