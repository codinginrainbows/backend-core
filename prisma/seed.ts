/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional)
  await prisma.surveyResponse.deleteMany();
  await prisma.surveyRun.deleteMany();
  await prisma.surveyQuestion.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.company.deleteMany();

  // ======================================================
  // 1. CRIAR EMPRESAS
  // ======================================================
  console.log('📦 Criando empresas...');

  const company1 = await prisma.company.create({
    data: {
      name: 'TechCorp Solutions',
      domain: 'techcorp.com',
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'InnovateHub',
      domain: 'innovatehub.io',
    },
  });

  const company3 = await prisma.company.create({
    data: {
      name: 'StartupXYZ',
      domain: null,
    },
  });

  console.log(`✅ ${3} empresas criadas`);

  // ======================================================
  // 2. CRIAR FUNCIONÁRIOS
  // ======================================================
  console.log('👥 Criando funcionários...');

  const admin1 = await prisma.employee.create({
    data: {
      email: 'admin@techcorp.com',
      name: 'Carlos Silva',
      password: '$2a$10$XqZ8j9Hq9Z8j9Hq9Z8j9He',
      role: 'ADMIN',
      companyId: company1.id,
    },
  });

  const manager1 = await prisma.employee.create({
    data: {
      email: 'manager@techcorp.com',
      name: 'Maria Santos',
      password: '$2a$10$XqZ8j9Hq9Z8j9Hq9Z8j9He',
      role: 'MANAGER',
      companyId: company1.id,
    },
  });

  const employee1 = await prisma.employee.create({
    data: {
      email: 'joao.souza@techcorp.com',
      name: 'João Souza',
      password: '$2a$10$XqZ8j9Hq9Z8j9Hq9Z8j9He',
      role: 'EMPLOYEE',
      companyId: company1.id,
    },
  });

  const employee2 = await prisma.employee.create({
    data: {
      email: 'ana.costa@techcorp.com',
      name: 'Ana Costa',
      password: '$2a$10$XqZ8j9Hq9Z8j9Hq9Z8j9He',
      role: 'EMPLOYEE',
      companyId: company1.id,
    },
  });

  const admin2 = await prisma.employee.create({
    data: {
      email: 'admin@innovatehub.io',
      name: 'Pedro Oliveira',
      password: '$2a$10$XqZ8j9Hq9Z8j9Hq9Z8j9He',
      role: 'ADMIN',
      companyId: company2.id,
    },
  });

  const employee3 = await prisma.employee.create({
    data: {
      email: 'julia.almeida@innovatehub.io',
      name: 'Júlia Almeida',
      password: '$2a$10$XqZ8j9Hq9Z8j9Hq9Z8j9He',
      role: 'EMPLOYEE',
      companyId: company2.id,
    },
  });

  console.log(`✅ ${6} funcionários criados`);

  // ======================================================
  // 3. CRIAR CONVITES
  // ======================================================
  console.log('✉️  Criando convites...');

  await prisma.invitation.create({
    data: {
      email: 'novo.funcionario@techcorp.com',
      token: crypto.randomBytes(32).toString('hex'),
      role: 'EMPLOYEE',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      companyId: company1.id,
    },
  });

  await prisma.invitation.create({
    data: {
      email: 'manager.novo@innovatehub.io',
      token: crypto.randomBytes(32).toString('hex'),
      role: 'MANAGER',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      companyId: company2.id,
    },
  });

  await prisma.invitation.create({
    data: {
      email: 'antigo@techcorp.com',
      token: crypto.randomBytes(32).toString('hex'),
      role: 'EMPLOYEE',
      status: 'ACCEPTED',
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      acceptedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      companyId: company1.id,
    },
  });

  console.log(`✅ ${3} convites criados`);

  // ======================================================
  // 4. CRIAR PESQUISAS (SURVEYS)
  // ======================================================
  console.log('📊 Criando pesquisas...');

  const survey1 = await prisma.survey.create({
    data: {
      title: 'Pulse Semanal - Satisfação',
      description: 'Pesquisa semanal para medir o engajamento da equipe',
      isActive: true,
      companyId: company1.id,
      questions: {
        create: [
          {
            text: 'Como você se sente em relação ao seu trabalho esta semana?',
            type: 'scale',
            order: 1,
          },
          {
            text: 'Você se sente valorizado(a) pela equipe?',
            type: 'boolean',
            order: 2,
          },
          {
            text: 'O que poderia melhorar?',
            type: 'text',
            order: 3,
          },
        ],
      },
    },
    include: {
      questions: true,
    },
  });

  await prisma.survey.create({
    data: {
      title: 'Feedback Trimestral',
      description: 'Avaliação trimestral do ambiente de trabalho',
      isActive: false,
      companyId: company1.id,
      questions: {
        create: [
          {
            text: 'Como você avalia o ambiente de trabalho?',
            type: 'scale',
            order: 1,
          },
          {
            text: 'Você recomendaria a empresa para um amigo?',
            type: 'boolean',
            order: 2,
          },
        ],
      },
    },
    include: {
      questions: true,
    },
  });

  console.log(`✅ ${2} pesquisas criadas`);

  // ======================================================
  // 5. CRIAR RODADAS DE PESQUISA (SURVEY RUNS)
  // ======================================================
  console.log('🔄 Criando rodadas de pesquisa...');

  const run1 = await prisma.surveyRun.create({
    data: {
      surveyId: survey1.id,
      weekRef: '2025-W44',
      sentAt: new Date('2025-10-27'),
    },
  });

  const run2 = await prisma.surveyRun.create({
    data: {
      surveyId: survey1.id,
      weekRef: '2025-W45',
      sentAt: new Date(),
    },
  });

  console.log(`✅ ${2} rodadas criadas`);

  // ======================================================
  // 6. CRIAR RESPOSTAS
  // ======================================================
  console.log('💬 Criando respostas...');

  await prisma.surveyResponse.create({
    data: {
      runId: run1.id,
      employeeId: employee1.id,
      answers: {
        question_1: 8,
        question_2: true,
        question_3: 'Mais feedbacks regulares',
      },
    },
  });

  await prisma.surveyResponse.create({
    data: {
      runId: run1.id,
      employeeId: employee2.id,
      answers: {
        question_1: 9,
        question_2: true,
        question_3: 'Está ótimo!',
      },
    },
  });

  await prisma.surveyResponse.create({
    data: {
      runId: run2.id,
      employeeId: employee1.id,
      answers: {
        question_1: 7,
        question_2: false,
        question_3: 'Mais flexibilidade no horário',
      },
    },
  });

  console.log(`✅ ${3} respostas criadas`);

  console.log('\n✨ Seed concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`   - ${3} empresas`);
  console.log(`   - ${6} funcionários`);
  console.log(`   - ${3} convites`);
  console.log(`   - ${2} pesquisas`);
  console.log(`   - ${2} rodadas`);
  console.log(`   - ${3} respostas`);
  console.log('\n🔑 Credenciais de login:');
  console.log('   - admin@techcorp.com / admin123');
  console.log('   - manager@techcorp.com / admin123');
  console.log('   - joao.souza@techcorp.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
