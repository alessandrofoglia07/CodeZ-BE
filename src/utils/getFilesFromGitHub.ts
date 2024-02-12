// BACKUP
// TODO: REMOVE THIS FILE

// import axios from 'axios';
// import File from '../models/delta.js';
// import pLimit from 'p-limit';

// interface GitHubFile {
//     name: string;
//     type: 'file' | 'dir';
//     download_url: string | null;
//     path: string;
// }

// const limit = pLimit(10);

// const getFilesFromGitHub = async (author: string, repo: string, projectId: string, dir?: string): Promise<string[]> => {
//     const res = await axios.get(`https://api.github.com/repos/${author}/${repo}/contents/${dir ? `${dir}` : ''}`);

//     const files: string[] = [];

//     await Promise.all(
//         res.data.map(async (file: GitHubFile) => {
//             if (file.type === 'dir') {
//                 const newFolder = new File({
//                     name: file.name,
//                     type: 'folder',
//                     path: file.path,
//                     project: projectId
//                 });
//                 await newFolder.save();
//                 const filesIds = await limit(() => getFilesFromGitHub(author, repo, projectId, file.path));
//                 files.push(newFolder._id, ...filesIds);
//                 return;
//             }

//             if (!file.download_url) return;

//             // TODO: ADD WAY TO MINIMIZE NUMBER OF REQUESTS AND DATA DOWNLOADED IN CASE OF LARGE FILES OR CODEBASES
//             const content = (await axios.get(file.download_url)).data.toString();
//             const newFile = new File({
//                 name: file.name,
//                 type: file.type,
//                 path: file.path,
//                 content,
//                 project: projectId
//             });
//             await newFile.save();

//             files.push(newFile._id);
//         })
//     );

//     return files;
// };

// export default getFilesFromGitHub;
