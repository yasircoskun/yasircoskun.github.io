const AES = require("crypto-js/aes");
const fs = require('fs');

var file_path = process.argv[2]
var pass = "Hayır";
var hint = "Parolayı biliyor musun?"
console.log(process.argv.length);
if (process.argv.length > 3) {
    pass = process.argv[3];
}
if(process.argv.length > 4){
    hint = process.argv[4]
}
var file_content = fs.readFileSync(file_path, 'utf8')
var file_content_encrypted = AES.encrypt(file_content, pass).toString();
var file_dest = file_path.substring(0, file_path.lastIndexOf("\\"));
var file_name = file_path.substring(0, file_path.lastIndexOf("."));
var file_ext = file_path.substring(file_path.lastIndexOf(".") + 1, file_path.length);
fs.writeFileSync(file_name + "~" + file_ext + ".enc", hint + "\n" + file_content_encrypted);
console.log(file_path);
console.log(file_dest);
var ls = fs.readFileSync(file_dest + "/ls", { encoding: 'utf8', flag: 'r' });
if (ls.indexOf("\nfile " + file_name.replace(".\\", "") + "~" + file_ext + ".enc") == -1) {
    fs.appendFileSync(file_dest + "/ls", "\nfile " + file_name.replace(".\\", "") + "~" + file_ext + ".enc");
}