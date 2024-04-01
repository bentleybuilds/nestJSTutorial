import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { stat } from 'fs';

@Injectable()
export class TasksService {
        private tasks: Task[] = [];

        getAllTasks(): Task[] {
            return this.tasks;
        }

        getTasksWithFilters(filterDto: GetTasksFilterDTO): Task[] {
            const {status, search} = filterDto;
            let tasks = this.getAllTasks()

            if(status) {
                tasks = tasks.filter(task => task.status == status)
            }

            if(search) {
                tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
            }

            return tasks
        }

        createTask(createTaskDto:CreateTaskDto): Task {

            const { title, description } = createTaskDto;

            const task: Task = {
                id: uuid(),
                title,
                description,
                status: TaskStatus.OPEN,
            };

            this.tasks.push(task);
            return task;
        }

        getTaskById(id: string): Task {
            const task = this.tasks.find(task => task.id === id)
            
            if(!task){
                throw new NotFoundException(`Task with ID ${id} not found`);
            } else {
                return task
            }
        }

        deleteTaskById(id:string): void {
            const deletedTask = this.getTaskById(id)
            this.tasks.splice(this.tasks.indexOf(deletedTask),1)
        }

        updateTaskStatus(id:string, status:TaskStatus) : Task {
            const updatedTask = this.getTaskById(id)
            updatedTask.status = status
            return updatedTask
        }
}
