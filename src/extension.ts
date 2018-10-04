'use strict';
import { window, commands, tasks, ExtensionContext, Task, debug, workspace, WorkspaceFolder } from 'vscode';
import { DataProvider, TaskElement } from './dataProvider';

export function activate(context: ExtensionContext) {
    let treeProvider = new DataProvider(context);
    
    window.registerTreeDataProvider('quickRunPanel', treeProvider);
    commands.registerCommand('quickRunPanel.refresh', () => treeProvider.refresh());
    let disposable = commands.registerCommand('quickRunPanel.runSelection', (task: TaskElement | String) => {
        if  (task instanceof Task) {
            runTask(task);
        } else {
            launchDebug(task as string);
        }
    });
    context.subscriptions.push(disposable);
}

function runTask(task: Task) {
    tasks.executeTask(task);
}

function launchDebug(debugTask: string) {
    let workspaceFolder: WorkspaceFolder | undefined;
    if (workspace.workspaceFolders !== undefined) {
        workspaceFolder = workspace.workspaceFolders[0];
    } else {
        workspaceFolder = undefined;
    }
    debug.startDebugging(workspaceFolder, debugTask);
}

export function deactivate() {
}