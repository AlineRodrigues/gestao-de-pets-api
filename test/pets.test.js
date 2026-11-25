import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

describe('API de Pets', () => {
  let token;
  let petCriadoId;

  // Autentica o administrador antes dos testes.
  before(async () => {
    const resposta = await request(app)
      .post('/api/auth/login')
      .send({
        email: ADMIN_EMAIL,
        senha: ADMIN_PASSWORD,
      });

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('token');

    token = resposta.body.token;
  });

  it('deve impedir a consulta de pets sem autenticação', async () => {
    const resposta = await request(app)
      .get('/api/pets');

    expect(resposta.status).to.equal(401);
  });

  it('deve impedir o cadastro de pets sem autenticação', async () => {
    const resposta = await request(app)
      .post('/api/pets')
      .send({
        nome: 'Pet sem autenticação',
        especie: 'cachorro',
      });

    expect(resposta.status).to.equal(401);
  });

  it('deve cadastrar um pet com autenticação válida', async () => {
    const novoPet = {
      nome: `Pet de teste ${Date.now()}`,
      especie: 'cachorro',
      raca: 'SRD',
      idade: 3,
    };

    const resposta = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(novoPet);

    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.include({
      nome: novoPet.nome,
      especie: novoPet.especie,
      raca: novoPet.raca,
      idade: novoPet.idade,
    });

    expect(resposta.body).to.have.property('id');

    petCriadoId = resposta.body.id;
  });

  it('deve listar os pets cadastrados com autenticação válida', async () => {
    const resposta = await request(app)
      .get('/api/pets')
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.be.an('array');

    const petEncontrado = resposta.body.find(
      (pet) => pet.id === petCriadoId
    );

    expect(petEncontrado).to.exist;
  });
});