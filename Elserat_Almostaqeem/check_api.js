const fs = require('fs');
try {
    const data = JSON.parse(fs.readFileSync('mp3quran_api.json', 'utf8'));
    const mapping = {};
    data.reciters.forEach(r => {
        if (r.moshaf && r.moshaf.length > 0) {
            r.moshaf.forEach(m => {
                const url = m.server;
                const recitersList = ['minsh', 'basit', 'husr', 'refat', 'bna', 'shuaisha', 'mustafa', 'ahmad_nu', 'sayed', 'afs', 'maher', 'sds', 'shur', 'yasser', 'balilah', 's_gmd', 'minsh_m', 'basit_m', 'husr_m'];
                recitersList.forEach(id => {
                    if (url === `https://server10.mp3quran.net/${id}/` ||
                        url === `https://server8.mp3quran.net/${id}/` ||
                        url.includes(`/${id}/`) || url.endsWith(`/${id}`)) {
                        // Use a specific key to distinguish murattal/mujawwad if possible
                        mapping[`${r.name} - ${m.name}`] = url;
                    }
                });
            });
        }
    });
    fs.writeFileSync('servers.json', JSON.stringify(mapping, null, 2));
    console.log("Written to servers.json");
} catch (err) {
    console.error("Error:", err);
}
