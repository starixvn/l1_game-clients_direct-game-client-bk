const fs = require("fire-fs");
const path = require("path");
const mount = function () {
    const projectPath = Editor.projectPath || Editor.Project.path;
    console.log("projectPath: ", projectPath);
    const resourcePath = path.join(projectPath, "assets/resources");
    const filePath = path.join(resourcePath, "bundle-information.js");
    const templatePath = path.join(__dirname, "template.txt");
    if (!fs.existsSync(resourcePath)) {
        fs.ensureDirSync(resourcePath);
    }
    if (!fs.existsSync(filePath)) {
        fs.copyFileSync(templatePath, filePath);
    }
};
exports.mount = mount;
