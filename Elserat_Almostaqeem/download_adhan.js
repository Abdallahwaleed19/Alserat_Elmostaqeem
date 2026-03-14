const https = require('https');

const url = 'https://doaatv.com/listen/1017';

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Output the entire HTML or try to regex for <audio> or <source> or anything resembling a media file
        console.log("Searching for anything with .mp3, .m4a, .wav in the entire source...");
        const mediaMatches = data.match(/https?:\/\/[^\s"'<>]+(?:\.mp3|\.m4a|\.wav)[^\s"'<>]*/gi);
        if (mediaMatches) {
            console.log("Found Media URLs:", mediaMatches);
        } else {
            console.log("No media matching direct extensions found. Dumping parts of HTML containing 'audio' or 'source'...");
            const audioLines = data.split('\n').filter(line => line.includes('audio') || line.includes('source') || line.includes('listen'));
            console.log(audioLines.join('\n'));

            // Look for data-url or similar
        }
    });
}).on('error', (err) => {
    console.error('Error fetching URL:', err.message);
});
