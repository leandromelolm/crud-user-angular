const spreadsheetId = env().envSpreadsheetId;
const folderId = env().envFolderId;
const doc = SpreadsheetApp.openById(spreadsheetId);
const sheet = doc.getSheetByName('page1');

function doPost(e) {
 try {
    let dados = JSON.parse(e.postData.contents);
    const imageBlob = processImageBlob(dados.base64File);
    const folder = DriveApp.getFolderById(folderId);
    const id = sheet.getLastRow() + 1;
    const file = folder.createFile(imageBlob.setName(`${id}_image.png`));
    sheet.appendRow([new Date(), id, dados.userName, dados.matricula, dados.cpf, dados.distrito, dados.unidade ,file.getDownloadUrl()]);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      fileId: file.getId(),
      sheetId: id,
      message: "Arquivo enviado com sucesso!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function processImageBlob(base64Content) {
  const decodedContent = Utilities.base64Decode(base64Content); 
  const blob = Utilities.newBlob(decodedContent, 'image/png', 'uploaded_image.png');
  return blob;
}

function env_() {
  const envSpreadsheetId = '';
  const envFolderId = '';
  return {envSpreadsheetId, envFolderId};
}

/**
 *  Projeto AtaOnline Google Apps Script *  
 * 
 * criar o projeto do tipo: web app
 * permissão de acesso: qualquer pessoa * 
 * 
 * envFolderId = id da pasta que será salva no google drive
 * envSpreadsheetId: id da panilha google
 * 
 * renover função env_() para env()
 * 
 * */