import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  Response,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { TaskDto, TaskUpdate } from 'src/auth/dto/auth.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':authorId')
  getMyTask(@Param('authorId') authorId: string, @Req() req) {
    return this.tasksService.getMyTask(authorId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':authorId/:filter')
  getFilterTask(
    @Param('authorId') authorId: string,
    @Param('filter')
    filter: string,
    @Req() req,
  ) {
    return this.tasksService.getFilterTask(authorId, filter, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/create')
  create(@Param('id') id: string, @Body() dto: TaskDto) {
    return this.tasksService.create(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/update/:taskId')
  async updateTask(
    @Param('id') id: string,
    @Param('taskId')
    taskId: string,
    @Request() req,
    @Response() res,
    @Body() dto: TaskUpdate,
  ) {
    return this.tasksService.updateTask(id, taskId, dto, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/delete/:taskId')
  async deleteTask(
    @Param('id') id: string,
    @Param('taskId')
    taskId: string,
    @Request() req,
    @Response() res,
  ) {
    return this.tasksService.deleteTask(id, taskId, req, res);
  }

  @Get()
  getTasks() {
    return this.tasksService.getTasks();
  }
}
