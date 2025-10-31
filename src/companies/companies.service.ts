import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../database/prisma.service';
import type { Company } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const domain = createCompanyDto.domain;

    const existingCompany = await this.prisma.company.findUnique({
      where: { domain },
    });

    if (existingCompany) {
      throw new ForbiddenException(
        `Company with domain ${domain} already exists`,
      );
    }

    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        _count: {
          select: {
            users: true,
            surveys: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: true,
        surveys: true,
        invitations: true,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    try {
      return await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<Company> {
    try {
      return await this.prisma.company.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }
      throw error;
    }
  }
}
