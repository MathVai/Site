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
const createFileSystemNode = (name, parentNode = fileSystemRoot) => {
  const newNode = {
    id: (idCounter++).toString(36),
    name,
    children: [],
  };
  parentNode.children.push(newNode);
  document.fsIdToNode.set(newNode.id, newNode);
  return newNode;
};
document.createFileSystemNode = createFileSystemNode;

// We can create a few folders to start with
const folderDocuments = createFileSystemNode('Documents', fileSystemRoot);
const folderImages = createFileSystemNode('Images', fileSystemRoot);
const folderDownloads = createFileSystemNode('Downloads', fileSystemRoot);
const folderMusic = createFileSystemNode('Music', fileSystemRoot);
const folderVideos = createFileSystemNode('Videos', fileSystemRoot);
const folderProjects = createFileSystemNode('Projects', folderDocuments);
const folderSchool = createFileSystemNode('School', folderDocuments);
const folderWork = createFileSystemNode('Work', folderDocuments);
const folderPhotos = createFileSystemNode('Photos', folderImages);
const folderWallpapers = createFileSystemNode('Wallpapers', folderImages);
const folderSoftware = createFileSystemNode('Software', folderDownloads);
const folderGames = createFileSystemNode('Games', folderDownloads);
