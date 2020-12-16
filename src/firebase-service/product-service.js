import firebase from "./firebase";
const db = firebase.database().ref("/products");
const storage = firebase.storage().ref("/images");

class ProductDataService {
  isFileExists(fileName) {
    return new Promise((resolve) => {
      storage
        .child(fileName)
        .getDownloadURL()
        .then((url) => {
          console.log("File exists");
          resolve(true);
        })
        .catch(() => {
          console.log("File doesn't exist");
          resolve(false);
        });
    });
  }

  removeFile(fileUrl) {
    let imageRef = storage.child(fileUrl);
    imageRef
      .delete()
      .then(function () {
        console.log("File deleted successfully");
      })
      .catch(function (error) {
        console.log(error);
        console.log("Uh-oh, an error occurred!");
      });
  }

  loadFile(file, fileName) {
    return new Promise((resolve) => {
      let newImageRef = storage.child(fileName);
      newImageRef.put(file).then(async function (snapshot) {
        console.log("Uploaded a blob or file!");
        console.log(snapshot.metadata);
        let res = await new Promise((res) => {
          storage
            .child(snapshot.metadata.name)
            .getDownloadURL()
            .then((url) => {
              res([url, snapshot.metadata.name]);
            });
        });
        resolve(res);
      });
    });
  }
  getAll() {
    return db;
  }

  get(key) {
    return db.child(key);
  }

  create(product) {
    return db.push(product);
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}

export default new ProductDataService();
