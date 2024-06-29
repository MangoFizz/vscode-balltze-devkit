import * as child_process from 'child_process';
import * as util from 'util';

import * as vscode from "vscode"

const exec = util.promisify(child_process.exec);

class InvaderClient {
  private static editCmd = `invader-edit "%s"`;
  private static countCmd = `invader-edit "%s" -C %s`;
  private static getCmd = `invader-edit "%s" -G %s`;
  private static insertCmd = `invader-edit "%s" -I %s %s %s`;
  private static createCmd = `invader-edit "%s" -N`;
  private static eraseCmd = `invader-edit "%s" -E %s`;

  private static rootPath =
		vscode.workspace.workspaceFolders &&
		vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: undefined

  private static nulled(value: string | number): string | number | null {
    if (typeof value === 'number') {
      if ([0xFF, 0xFFFF, 0xFFFFFFFF].includes(value)) {
        return null;
      }
    }
    return value;
  }

  private static writeMapFields(key: string, value: any): string {
    let sentence = '';
    const valueType = typeof value;

    if (valueType !== 'object') {
      // Handle non-object types
    }

    if (valueType === 'string') {
      return ` -S ${key} "${value}"`;
    } else if (valueType === 'boolean') {
      return ` -S ${key} ${value ? 1 : 0}`;
    } else if (valueType === 'number') {
      return ` -S ${key} ${value}`;
    } else if (valueType === 'object') {
      if (Array.isArray(value)) {
        // Reserve elements space
        sentence += ` -I ${key} ${value.length} end`;
        value.forEach((element, index) => {
          sentence += this.writeMapFields(`${key}[${index}]`, element);
        });
        return sentence;
      }
      Object.entries(value).forEach(([subField, subValue]) => {
        if (!isNaN(Number(subField))) {
          sentence += this.writeMapFields(`${key}[${Number(subField)}]`, subValue);
        } else {
          sentence += this.writeMapFields(`${key}.${subField}`, subValue);
        }
      });
      return sentence;
    } else {
      throw new Error("Unknown property type!");
    }
  }

  private static async executeCommand(command: string): Promise<void> {
    try {
      console.log(`Executing: ${command}`);
      await exec(command, {
        cwd: InvaderClient.rootPath
      });
    } catch (error) {
      throw new Error(`Command execution failed: ${command}, with error: ${error}`);
    }
  }

  public static async edit(tagPath: string, keys: any): Promise<void> {
    console.log(`Editing: ${tagPath}`);
    let updateTagCmd = this.editCmd.replace('%s', tagPath);
    Object.entries(keys).forEach(([property, value]) => {
      updateTagCmd += this.writeMapFields(property, value);
    });
    await this.executeCommand(updateTagCmd);
  }

  public static async get(tagPath: string, key: string, index?: number, subkey?: string): Promise<string | number | null> {
    let cmd = this.getCmd.replace('%s', tagPath).replace('%s', key);
    if (index !== undefined) {
      cmd = this.getCmd.replace('%s', tagPath).replace('%s', `${key}[${index}]`);
      if (subkey) {
        cmd = this.getCmd.replace('%s', tagPath).replace('%s', `${key}[${index}].${subkey}`);
      }
    }
    const { stdout } = await exec(cmd);
    return this.nulled(stdout.trim());
  }

  public static async count(tagPath: string, key: string): Promise<number> {
    const cmd = this.countCmd.replace('%s', tagPath).replace('%s', key);
    const { stdout } = await exec(cmd);
    return parseInt(stdout.trim(), 10);
  }

  public static async erase(tagPath: string, key: string): Promise<void> {
    const cmd = this.eraseCmd.replace('%s', tagPath).replace('%s', key);
    await this.executeCommand(cmd);
  }

  public static async insert(tagPath: string, key: string, count: number, position: number | 'end' = 0): Promise<void> {
    const cmd = this.insertCmd.replace('%s', tagPath).replace('%s', key).replace('%s', count.toString()).replace('%s', position.toString());
    await this.executeCommand(cmd);
  }

  public static async create(tagPath: string, keys: any): Promise<void> {
    console.log(`Creating: ${tagPath}`);
    let createTagCmd = this.createCmd.replace('%s', tagPath);
    Object.entries(keys).forEach(([property, value]) => {
      createTagCmd += this.writeMapFields(property, value);
    });
    await this.executeCommand(createTagCmd);
  }
}

export default InvaderClient;
