const fs = require('fs');

const recitersList = [
    'minsh',
    'basit',
    'husr',
    'refat',
    'bna',
    'shuaisha',
    'mustafa/Almusshaf-Al-Mojawwad',
    'ahmad_nu',
    'sayed',
    'afs',
    'maher',
    'sds',
    'shur',
    'yasser',
    'balilah',
    's_gmd'
];

try {
    const data = JSON.parse(fs.readFileSync('mp3quran_api.json', 'utf8'));
    const reciters = data.reciters;
    
    console.log("Found matches:");
    reciters.forEach(r => {
        // Find if server URL contains any of our target IDs
        // mp3quran API structure usually has r.Server
        if (r.Server) {
            recitersList.forEach(id => {
                if (r.Server.includes(`/${id}/`) || r.Server.endsWith(`/${id}`)) {
                    console.log(`ID: ${id} -> URL: ${r.Server}`);
                }
            });
        }
    });

} catch (err) {
    console.error("Error:", err);
}
