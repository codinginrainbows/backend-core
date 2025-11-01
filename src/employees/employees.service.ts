import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../database/prisma.service';
import { Prisma, Employee } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Omit<Employee, 'password'>> {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email: createEmployeeDto.email },
    });

    if (existingEmployee) {
      throw new ForbiddenException('Email already in use');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: createEmployeeDto.companyId },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with ID ${createEmployeeDto.companyId} not found`,
      );
    }

    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);

    const employee = await this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        password: hashedPassword,
      },
    });

    const { password, ...result } = employee;
    return result;
  }

  async findAll() {
    return this.prisma.employee.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        companyId: true,
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            surveyResponses: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        companyId: true,
        company: true,
        surveyResponses: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Omit<Employee, 'password'>> {
    try {
      const employee = await this.prisma.employee.update({
        where: { id },
        data: updateEmployeeDto,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          companyId: true,
          company: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return employee;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const employee = await this.prisma.employee.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          companyId: true,
        },
      });

      return employee;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { email },
    });
  }
}
