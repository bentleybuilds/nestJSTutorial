import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.respository';
import { table } from 'console';


@Module({
  imports: [
    TypeOrmModule.forFeature([Task])
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
export class TasksModule {}
