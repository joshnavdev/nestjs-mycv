import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', async () => {
    const defaultEmail = 'jsdjakalalskdj@asd.com';
    const res = await request(app.getHttpServer()).post('/auth/signup').send({ email: defaultEmail, password: 'asdf' });

    expect(res.status).toBe(201);
    const { id, email } = res.body;
    expect(id).toBeDefined();
    expect(email).toEqual(defaultEmail);
  });
});
