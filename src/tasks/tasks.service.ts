import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { stat } from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TasksRepository } from './tasks.respository';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
    ) {}
      


        getTasks( filterDto: GetTasksFilterDTO): Promise<Task[]> {
            return this.tasksRepository.getTasks(filterDto)
        }
        // getAllTasks(): Task[] {
        //     return this.tasks;
        // }

        // getTasksWithFilters(filterDto: GetTasksFilterDTO): Task[] {
        //     const {status, search} = filterDto;
        //     let tasks = this.getAllTasks()

        //     if(status) {
        //         tasks = tasks.filter(task => task.status == status)
        //     }

        //     if(search) {
        //         tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
        //     }

        //     return tasks
        // }
        getTaskById(id: string): Promise<Task> {
            return this.tasksRepository.getTaskByID(id)
          
        }

        createTask(createTaskDto:CreateTaskDto): Promise<Task> {
            return this.tasksRepository.createTask(createTaskDto);
        }
      


        deleteTaskById(id:string):Promise<void> {
           
           return this.tasksRepository.deleteTaskById(id)
        }
       

        updateTaskStatus(id:string, status:TaskStatus) : Promise<Task> {
            return this.tasksRepository.updateTaskStatus(id, status)
        }
}
