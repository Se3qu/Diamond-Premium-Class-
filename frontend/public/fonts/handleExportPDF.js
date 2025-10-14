const fontUrl = "/fonts/Roboto-Regular.ttf";
const fontData = await fetch(fontUrl).then(res => res.arrayBuffer());
doc.addFileToVFS("Roboto-Regular.ttf", fontData);
doc.addFont("Roboto-Regular.ttf", "roboto", "normal");
doc.setFont("roboto", "normal");
