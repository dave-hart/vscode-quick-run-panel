import { TreeDataProvider, TreeItem, tasks, Task, TreeItemCollapsibleState, workspace, EventEmitter, Event, ExtensionContext, DebugConfiguration } from 'vscode';
import * as path from 'path';

export class DataProvider implements TreeDataProvider<TaskElement> {
	private _onDidChangeTreeData: EventEmitter<TaskElement | undefined> = new EventEmitter<TaskElement | undefined>();
	readonly onDidChangeTreeData: Event<TaskElement | undefined> = this._onDidChangeTreeData.event;
	constructor(private context: ExtensionContext) {
	}
 	// todo
	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	getTreeItem(element: TaskElement): TreeItem {
		return element;
	}

  	getChildren(element?: any): Thenable<TaskElement[]> {
    	return Promise.resolve(this.getAllContent());
	}

	/**
	 * Find all tasks, and filter on source
	 */
	private async getAllTasks(): Promise<TaskElement[]> {
    let taskElements: TaskElement[] = [];
    let allTasks = await tasks.fetchTasks();
    allTasks.forEach((task: any) => {
			let taskSources = workspace.getConfiguration().get("QuickRunPanel.taskSources") as string[];
			if (taskSources.some(value => value === task.source)) {
				taskElements.push(new TaskElement(task, TreeItemCollapsibleState.None, this.context, null));
			}
		});
		return taskElements;
	}

	private async getAllContent(): Promise<TaskElement[]> {
		let allTasks: TaskElement[] = [];
		let allConfigs: TaskElement[] = [];
		if (workspace.getConfiguration().get("QuickRunPanel.includeTasks") as boolean) {
			allTasks = await this.getAllTasks();
		}
		if (workspace.getConfiguration().get("QuickRunPanel.includeDebugConfigs")) {
			allConfigs = await this.getAllLaunchConfigs();
		}
		return allTasks.concat(allConfigs);
	}	

	private getAllLaunchConfigs(): TaskElement[] {
		let launchElements: TaskElement[] = [];
        const addConfig = (workspaceIndex: number | null, conf: any) => {
            launchElements.push(new TaskElement(conf, TreeItemCollapsibleState.None, this.context, workspaceIndex));
        };

		const folders = workspace.workspaceFolders;
        if (folders && (folders.length > 1)) {
            folders.forEach((folder: any, index: number) => {
                const config: Object[] | undefined = workspace.getConfiguration("launch", folder.uri).get("configurations");
				if (config) {
					config.forEach(addConfig.bind(this, index));
				}
            });
        } else {
            const config: Object[] | undefined = workspace.getConfiguration("launch").get("configurations");
			if (config) {
				config.forEach(addConfig.bind(this, null));
			}
        }
        
        return launchElements;
	}
}

export class TaskElement extends TreeItem {
	constructor(
		public readonly _task: Task | DebugConfiguration,
		public readonly collapsibleState: TreeItemCollapsibleState,
		private context: ExtensionContext,
		public readonly index: number | null
	) {
		super(_task.name, collapsibleState);
		let args: Task | string;
		if (this._task instanceof Task) {
			args = this._task;
		} else {
			args = _task.name;
		}
		super.command = {
			title: "title",
			command: "quickRunPanel.runSelection",
			arguments: [args, index]
		};

		this.tooltip = `${this._task.name}`;
	}

	/*get tooltip(): string {
		return `${this._task.name}`;
	}*/

	iconPath = {
		light: this.context.asAbsolutePath(path.join('resources', 'light', 'task.svg')),
		dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'task.svg'))
	};

}
