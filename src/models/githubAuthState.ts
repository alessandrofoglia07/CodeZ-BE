import { Schema, model } from 'mongoose';

const githubAuthStateSchema = new Schema(
    {
        state: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default model('GithubAuthState', githubAuthStateSchema);
