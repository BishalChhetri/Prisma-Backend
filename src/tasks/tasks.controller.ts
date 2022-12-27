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
  getMyTask(@Param() params: { authorId: string }, @Req() req) {
    return this.tasksService.getMyTask(params.authorId, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':authorId/:filter')
  getFilterTask(
    @Param() params: { authorId: string; filter: string },
    @Req() req,
  ) {
    return this.tasksService.getFilterTask(params.authorId, params.filter, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/create')
  create(@Param() params: { id: string }, @Body() dto: TaskDto) {
    return this.tasksService.create(params.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/update/:taskId')
  async updateTask(
    @Param() params: { id: string; taskId: string },
    @Request() req,
    @Response() res,
    @Body() dto: TaskUpdate,
  ) {
    return this.tasksService.updateTask(
      params.id,
      params.taskId,
      dto,
      req,
      res,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/delete/:taskId')
  async deleteTask(
    @Param() params: { id: string; taskId: string },
    @Request() req,
    @Response() res,
  ) {
    return this.tasksService.deleteTask(params.id, params.taskId, req, res);
  }

  @Get()
  getTasks() {
    return this.tasksService.getTasks();
  }
}
