import bcrypt from 'bcryptjs';
import Administrador from '../models/admin.model.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function seed() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'As variáveis ADMIN_EMAIL e ADMIN_PASSWORD devem ser definidas no ambiente.'
    );
  }

  let administrador = await Administrador.findById('admin-principal');

  if (!administrador) {
    await Administrador.create({
      _id: 'admin-principal',
      nome: 'Administrador do Sistema',
      email: ADMIN_EMAIL,
      senha: ADMIN_PASSWORD,
    });

    console.log('Administrador inicial criado com sucesso.');
    return;
  }

  const senhaCorreta = await bcrypt.compare(
    ADMIN_PASSWORD,
    administrador.senha
  );

  let houveAlteracao = false;

  if (administrador.email !== ADMIN_EMAIL) {
    administrador.email = ADMIN_EMAIL;
    houveAlteracao = true;
  }

  if (!senhaCorreta) {
    administrador.senha = ADMIN_PASSWORD;
    houveAlteracao = true;
  }

  if (houveAlteracao) {
    await administrador.save();
    console.log('Dados do administrador atualizados com sucesso.');
  }
}

await seed();

export default { seed };