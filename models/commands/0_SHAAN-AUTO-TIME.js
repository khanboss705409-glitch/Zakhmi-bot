module.exports.config = {
name: 'autosent',
version: '11.0',
hasPermssion: 0,
credits: 'ZAKHMI SAYAR',
description: 'India Time - Hindi Shayari - ZAKHMI SAYAR',
commandCategory: 'group messenger',
usages: '[]',
cooldowns: 3
};

const nam = [
{ timer: '12:00:00 AM', message: ['──── •💜• ────\n🕛 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 12:00 AM ⏳\n📅 {date}\n\nRaat ke 12 baje khwab sajte hain,\nDil me tere hi khayal bajte hain,\nNeend bhi ab ruth gayi hai humse,\nBas teri yaadon ke deep jalte hain.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '1:00:00 AM', message: ['──── •💜• ────\n🕐 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 1:00 AM ⏳\n📅 {date}\n\nRaat gehri hai, tanha dil hai,\nTeri kami ka ehsaas kal bhi tha aaj bhi hai,\nChaand bhi thak ke so gaya hai,\nPar dil tujhe hi yaad karta hai.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '2:00:00 AM', message: ['──── •💜• ────\n🕑 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 2:00 AM ⏳\n📅 {date}\n\n2 baje raat ke, sab so gaye,\nHum teri yaadon me kho gaye,\nDil ke zakhm gehre hote gaye,\nPar hum to Zakhmi hi ho gaye.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '3:00:00 AM', message: ['──── •💜• ────\n🕒 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 3:00 AM ⏳\n📅 {date}\n\nNa raat kat rahi hai, na din nikal raha,\nDil tere bina kahin lag nahi raha,\nZakhmi dil ka haal kya bataye,\nJo tujhe kabhi bhula nahi raha.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '4:00:00 AM', message: ['──── •💜• ────\n🕓 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 4:00 AM ⏳\n📅 {date}\n\nSubah hone ko hai, par neend nahi aati,\nTeri yaadon ki mehfil ab bhi sajti hai,\nDil kehta hai ek baar tu laut aa,\nZindagi phir se hasne lagti hai.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '5:00:00 AM', message: ['──── •💜• ────\n🕔 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 5:00 AM ⏳\n📅 {date}\n\nSubah ke 5 baje, nayi umeed jagi hai,\nRaat ke gham ko humne peeche chhoda hai,\nZakhmi dil bhi ab muskurayega,\nNayi subah ne ye wada kiya hai.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '6:00:00 AM', message: ['──── •💜• ────\n🕕 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 6:00 AM ⏳\n📅 {date}\n\nGood Morning, utth jao yaaron,\nChai garam hai, dil bhi garam hai,\nZindagi ek nayi shuruwat hai,\nZakhmi Sayar ka salaam hai.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '7:00:00 AM', message: ['──── •💜• ────\n🕖 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 7:00 AM ⏳\n📅 {date}\n\nSubah subah tera naam lete hain,\nDil se dua me tujhe yaad karte hain,\nTu khush rahe yahi dua hai,\nHum to bas yahi fariyaad karte hain.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '8:00:00 AM', message: ['──── •💜• ────\n🕗 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 8:00 AM ⏳\n📅 {date}\n\nZindagi me mushkile aati hain,\nPar has ke jeene wale kabhi harte nahi,\nJo dil se mehnat karte hain,\nKismat unka saath chodte nahi.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '9:00:00 AM', message: ['──── •💜• ────\n🕘 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 9:00 AM ⏳\n📅 {date}\n\nKaam ka time hai, lag jao sab,\nSapne dekhne se nahi, mehnat se bante hain khwab,\nZakhmi dil bhi kehta hai,\nAaj kuch kar dikhao yaar.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '10:00:00 AM', message: ['──── •💜• ────\n🕙 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 10:00 AM ⏳\n📅 {date}\n\nDin chadh gaya, roshni chha gayi,\nDil ki duniya phir se mehka gayi,\nTeri yaad ka ek paigam aaya,\nSubah meri aur bhi haseen ho gayi.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '11:00:00 AM', message: ['──── •💜• ────\n🕚 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 11:00 AM ⏳\n📅 {date}\n\nHasna sikho, muskurana sikho,\nDard ko bhi gale lagana sikho,\nZindagi me gham to aate jate hain,\nKhushi me jeena sikho.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '12:00:00 PM', message: ['──── •💜• ────\n🕛 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 12:00 PM ⏳\n📅 {date}\n\nDopahar ho gayi, khana kha lo yaar,\nKaam thoda side me rakho,\nZakhmi Sayar ka message aaya hai,\nDil ko thoda sukoon do.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '1:00:00 PM', message: ['──── •💜• ────\n🕐 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 1:00 PM ⏳\n📅 {date}\n\nDil ka dard zubaan par aata nahi,\nHar koi dard samajh pata nahi,\nJo sach me apna hota hai,\nWo kabhi rulaata nahi.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '2:00:00 PM', message: ['──── •💜• ────\n🕑 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 2:00 PM ⏳\n📅 {date}\n\nZindagi ki raahein aasan nahi,\nHar dil kabhi na kabhi tootta hai,\nPar jo toota dil jod le,\nWahi sabse majboot hota hai.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '3:00:00 PM', message: ['──── •💜• ────\n🕒 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 3:00 PM ⏳\n📅 {date}\n\nUmeed roz tootti hai, roz banti hai,\nBas usko pakde raho, girne mat do,\nKyunki umeed hi to zindagi hai,\nIsi se to duniya chalti hai.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '4:00:00 PM', message: ['──── •💜• ────\n🕓 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 4:00 PM ⏳\n📅 {date}\n\nShaam dhal rahi hai, chai ka time hai,\nThakan ko thoda aaram do,\nZakhmi Sayar ki shayari suno,\nDil ko thoda pyaar do.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '5:00:00 PM', message: ['──── •💜• ────\n🕔 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 5:00 PM ⏳\n📅 {date}\n\nJo apne sapno ko dil se jeeta hai,\nWo zindagi me kabhi harta nahi,\nHaar wahi maanta hai,\nJo umeed chhod deta hai.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '6:00:00 PM', message: ['──── •💜• ────\n🕕 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 6:00 PM ⏳\n📅 {date}\n\nShaam ho gayi, ghar chalo yaar,\nDin bhar ki thakan ko bhool jao,\nDil ke zakhmon ko sahlane ka,\nYehi to sahi time hai.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '7:00:00 PM', message: ['──── •💜• ────\n🕖 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 7:00 PM ⏳\n📅 {date}\n\nYaad rakhna, dukh aur khushi waqt jaise hain,\nEk aata hai to dusra jata hai,\nIsliye kabhi akela mehsoos mat karna,\nZakhmi ka bot tere saath hai.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '8:00:00 PM', message: ['──── •💜• ────\n🕗 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 8:00 PM ⏳\n📅 {date}\n\nJo beet gaya use bhool jao,\nJo ab hai uspar dhyaan do,\nAaj ki mehnat hi kal ka chehra banayegi,\nYe baat hamesha yaad rakho.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '9:00:00 PM', message: ['──── •💜• ────\n🕘 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 9:00 PM ⏳\n📅 {date}\n\nRaat ho gayi, khwabon ka time hai,\nDil ki baatein dil me chhupi hain,\nZakhmi Sayar kehta hai so jao,\nKal subah phir milenge.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '10:00:00 PM', message: ['──── •💜• ────\n🕙 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 10:00 PM ⏳\n📅 {date}\n\nZindagi ki sabse badi saza,\nKisi ko dil se pyaar karke khona hai,\nPar yahi wo pal hota hai,\nJab insaan sabse majboot hota hai.\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝗧𝗛𝗔𝗞𝗨𝗥_𝗦𝗔𝗛𝗔𝗕★'] },
{ timer: '11:00:00 PM', message: ['──── •💜• ────\n🕚 𝐀𝐛𝐡𝐢 𝐓𝐢𝐦𝐞 𝐇𝐚𝐢 11:00 PM ⏳\n📅 {date}\n\nZindagi me hamesha khush rehne ki koshish karo,\nKyunki jab tum khush hote ho, duniya saath hoti hai,\nAur jab udaas hote ho, duniya chali jati hai.\nGood Night 🌙\n\n──── •💜• ────\n»»𝐎𝐖𝐍𝐄𝐑««★𝒁𝑨𝑲𝑯𝑴𝑰 𝑺𝑨𝒀𝑨𝑹★'] }
];

module.exports.onLoad = o => {
  setInterval(() => {
    // India Time - IST (UTC +5:30)
    const now = new Date();
    const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    const timeStr = ist.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    const dateStr = ist.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const current = nam.find(i => i.timer == timeStr);
    if (current) {
      const msg = current.message[0].replace('{date}', dateStr);
      global.data.allThreadID.forEach(id => o.api.sendMessage(msg, id));
    }
  }, 1000);
};

module.exports.run = o => {};
