import * as bcrypt from 'bcrypt';

export default function hashing(pass: string) {

    var hash = bcrypt.hashSync('bacon', 8);
    return hash;
}
