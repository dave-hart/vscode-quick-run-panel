# quick-run-panel README

This is the README for the extension "quick-run-panel". 

## Features

This extension adds a VSCODE quick run panel to the explorer pane listing VSCode tasks and debug configurations from the sources listed in the extension settings.

You run a task by clicking on it

## Extension Settings

There are three settings properties that define the sources for the content of the quick run panel.

* `QuickRunPanel.includeTasks`: This boolean determines whether vscode task objects are shown in the quick run panel
* `QuickRunPanel.includeDebugConfigs`: This boolean determines whether workspace debug configurations are shown in the quick run panel
* `QuickRunPanel.taskSources`: This list of strings determines which task sources are included in the includeTasks option is true

Valid source values include:
* "workspace"
* "npm"

The defaults values are:

* `QuickRunPanel.includeTasks`: true
* `QuickRunPanel.includeDebugConfigs`: true
* `QuickRunPanel.taskSources`:['workspace']

### 0.0.3

Fix git hub link
