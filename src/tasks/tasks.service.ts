import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { TaskDto, TaskUpdate } from 'src/auth/dto/auth.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(authorId, dto: TaskDto) {
    const { title, description } = dto;

    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('No user found');
    }
    await this.prisma.task.create({
      data: {
        authorId,
        title,
        description,
      },
    });

    return { message: 'Task created succesfully' };
  }

  async updateTask(id, taskId, dto: TaskUpdate, req: Request, res: Response) {
    let { title, description, isCompleted } = dto;
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('No user found');
    }

    const foundTask = await this.prisma.task.findMany({
      where: {
        id: taskId,
        authorId: id,
      },
    });

    if (!foundTask) {
      throw new BadRequestException('You are not authorized!');
    }

    await this.prisma.task.update({
      where: { id: taskId },
      data: { title, description, isCompleted },
    });

    return res.send({ message: 'Task Update succesfully' });
  }

  async deleteTask(id, taskId, req: Request, res: Response) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('You are not allowed to delete.');
    }

    const foundTask = await this.prisma.task.findMany({
      where: {
        authorId: id,
        id: taskId,
      },
    });

    if (!foundTask) {
      throw new BadRequestException('You are not authorized!');
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    return res.send({ message: 'Task deleted Succesfully!' });
  }

  async getMyTask(authorId: string, req: Request) {
    const foundTask = await this.prisma.task.findMany({
      where: { authorId },
    });

    if (!foundTask) {
      throw new NotFoundException();
    }

    return { task: foundTask };
  }

  async getFilterTask(authorId: string, filter: string, req: Request) {
    let isCompleted = false;
    filter === 'true' ? (isCompleted = true) : isCompleted;

    const foundTask = await this.prisma.task.findMany({
      where: { authorId, isCompleted },
    });

    if (!foundTask) {
      throw new NotFoundException();
    }

    return { task: foundTask };
  }

  async getTasks() {
    const tasks = await this.prisma.task.findMany({});

    return { tasks };
  }
}
