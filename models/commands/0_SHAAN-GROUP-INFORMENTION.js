const fs = require("fs");
const request = require("request");
module.exports.config = {
	name: "groupinf",
	version: "1.0.0", 
	hasPermssion: 1,
	credits: "SHAAN BABU",
	description: "THIS BOT WAS MADE BY MR SHAAN BABU",
	commandCategory: "GROUP INFORMETION", 
	usages: "PREFIX", 
	cooldowns: 0,
	dependencies: [] 
};

module.exports.run = async function({ api, event, args }) {
	let threadInfo = await api.getThreadInfo(event.threadID);
	var memLength = threadInfo.participantIDs.length;
	let threadMem = threadInfo.participantIDs.length;
	var nameMen = [];
    var gendernam = [];
    var gendernu = [];
    var nope = [];
     for (let z in threadInfo.userInfo) {
     	var gioitinhone = threadInfo.userInfo[z].gender;
     	var nName = threadInfo.userInfo[z].name;
        if(gioitinhone == "MALE"){gendernam.push(z+gioitinhone)}
        else if(gioitinhone == "FEMALE"){gendernu.push(gioitinhone)}
            else{nope.push(nName)}
    };
	var nam = gendernam.length;
    var nu = gendernu.length;
	let qtv = threadInfo.adminIDs.length;
	let sl = threadInfo.messageCount;
	let u = threadInfo.nicknames;
	let icon = threadInfo.emoji;
	let threadName = threadInfo.threadName;
	let id = threadInfo.threadID;
	let sex = threadInfo.approvalMode;
			var pd = sex == false ? 'TURNED OFF' : sex == true ? 'TURNED ON' : 'NOTHING';
			var callback = () =>
				api.sendMessage(
					{
						body: `🌺 GROUP NAME 𒁍 ${threadName}\n🌺 GROUP UID 𒁍 ${id}\n🌺 GROUP APPROVAL 𒁍 ${pd}\n🌺 GROUP EMOJI 𒁍 ${icon}\n🌺 TOTAL MEMBER 𒁍 ${threadMem}\n🌺 TOTAL MALE 𒁍 ${nam}\n🌺 TOTAL FEMALE 𒁍 ${nu}\n🌺TOTAL GROUP ADMIN 𒁍 ${qtv}\n🌺 TOTAL GROUP MESSAGES 𒁍 ${sl}\n\n════════════════════════ ❁\nBOT CREATER BY MR IMRAN BABU 🙂✌️`,
						attachment: fs.createReadStream(__dirname + '/cache/1.png')
					},
					event.threadID,
					() => fs.unlinkSync(__dirname + '/cache/1.png'),
					event.messageID
				);
			return request(encodeURI(`${threadInfo.imageSrc}`))
				.pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
				.on('close', () => callback());
	    }