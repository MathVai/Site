// A folder is a set of files and folders. Here is the file containing the root
// of the file system. It is a JSON object that contains the root folder and its
// children. The root folder is a folder with a name and an array of children.

// This is the root of the file system, analogous to C:\ on Windows or / on Unix
const fileSystemRoot = {
  id: '0',
  name: 'root',
  children: [],
};

let idCounter = 1;
document.fsIdToNode = new Map();
document.fsIdToNode.set(fileSystemRoot.id, fileSystemRoot);

// We will have to handle the creation and deletion of files and folders.
const createNewFolder = (name, parentFolder = fileSystemRoot) => {
  const newFolder = {
    id: (idCounter++).toString(36),
    name,
    children: [],
  };
  parentFolder.children.push(newFolder);
  document.fsIdToNode.set(newFolder.id, newFolder);
  return newFolder;
};
document.createNewFolder = createNewFolder;

// We can create a few folders to start with
const folderDocuments = createNewFolder('Documents', fileSystemRoot);
const folderImages = createNewFolder('Images', fileSystemRoot);
const folderDownloads = createNewFolder('Downloads', fileSystemRoot);
const folderMusic = createNewFolder('Music', fileSystemRoot);
const folderVideos = createNewFolder('Videos', fileSystemRoot);
const folderProjects = createNewFolder('Projects', folderDocuments);
const folderSchool = createNewFolder('School', folderDocuments);
const folderWork = createNewFolder('Work', folderDocuments);
const folderPhotos = createNewFolder('Photos', folderImages);
const folderWallpapers = createNewFolder('Wallpapers', folderImages);
const folderSoftware = createNewFolder('Software', folderDownloads);
const folderGames = createNewFolder('Games', folderDownloads);
