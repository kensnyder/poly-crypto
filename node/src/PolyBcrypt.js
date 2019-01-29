import bcrypt from 'bcryptjs';

export class PolyBcrypt {
	static hash(password) {
		// example output:
		// $2a$10$Smzv/blYQbJBp8v8Wk26uuXEFXSeyjvGsx3VBzZ1zPgXg/Nx9GDuy
		return bcrypt.hashSync(password);
	}

	static verify(password, hash) {
		return bcrypt.compareSync(password, hash);
	}
}
