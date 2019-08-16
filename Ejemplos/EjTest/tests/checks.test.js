/**
 * Checker for cmd-iterators assignment
 */

// IMPORTS
const should = require('chai').should();
const path = require('path');
const fs = require('fs-extra');
const Utils = require('./utils');
const to = require('./to');
const exec = require("child_process").exec;

const path_assignment = path.resolve(path.join(__dirname, "../", "mod2_cmd_iterators.js"));

// CRITICAL ERRORS
let error_critical = null;

//TESTS
describe("mooc_node-mod2_cmd_iterators", function () {

    it('', async function () { this.name = `1: Chequeando que el archivo 'mooc_node-mod2_cmd_iterators.js' existe...`;
        this.score = 1;
        this.msg_ok = `El archivo 'mooc_node-mod2_cmd_iterators.js' fue encontrado`;
        this.msg_err = `No se encontró el archivo '${path_assignment}'`;
        const [error_path, path_ok] = await to(fs.pathExists(path_assignment));
        if (error_path) {
            error_critical = this.msg_err;
        }
        path_ok.should.be.equal(true);
    });

    it('', async function () { this.name = `2: Chequeando que el comando 'mooc_node-mod2_cmd_iterators.js' detecte los argumentos`;
        this.score = 1.75;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Test exitoso";
            this.input = "one";
            this.expected = "one: 1";
            this.output = "";
            [error_run, this.output] = await to(new Promise((resolve, reject) => {
                exec(`node ${path_assignment} ${this.input}`, (err, stdout) =>
                    err ? reject(err) : resolve(stdout))
            }));
            if (error_run) {
                this.msg_err = `Error al ejecutar 'mooc_node-mod2_cmd_iterators.js': ${error_run}`;
                should.not.exist(error_run);
            } else {
                this.msg_err = `NO se obtuvo el resultado esperado.\n\t\tInput: ${this.input}\n\t\tEsperaba: ${this.expected}\n\t\tRecibí: ${this.output.trim()}`;
                Utils.search(this.expected, this.output).should.be.equal(true);
            }
        }
    });

    it('', async function () { this.name = `3: Chequeando que el comando 'mooc_node-mod2_cmd_iterators.js' agrupe los argumentos`;
        this.score = 1.75;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Test exitoso";
            this.input = "one one";
            this.expected = "one: 2";
            this.output = "";
            [error_run, this.output] = await to(new Promise((resolve, reject) => {
                exec(`node ${path_assignment} ${this.input}`, (err, stdout) =>
                    err ? reject(err) : resolve(stdout))
            }));
            if (error_run) {
                this.msg_err = `Error al ejecutar 'mooc_node-mod2_cmd_iterators.js': ${error_run}`;
                should.not.exist(error_run);
            } else {
                this.msg_err = `NO se obtuvo el resultado esperado.\n\t\tInput: ${this.input}\n\t\tEsperaba: ${this.expected}\n\t\tRecibí: ${this.output.trim()}`;
                Utils.search(this.expected, this.output).should.be.equal(true);
            }
        }
    });

    it('', async function () { this.name = `4: Chequeando que el commando 'mooc_node-mod2_cmd_iterators.js' ordene los argumentos`;
        this.score = 1.75;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Test exitoso";
            this.input = "two one";
            this.expected = /one.+?two/s;
            this.output = "";
            [error_run, this.output] = await to(new Promise((resolve, reject) => {
                exec(`node ${path_assignment} ${this.input}`, (err, stdout) =>
                    err ? reject(err) : resolve(stdout))
            }));
            if (error_run) {
                this.msg_err = `Error al ejecutar 'mooc_node-mod2_cmd_iterators.js', Received: ${error_run}`;
                should.not.exist(error_run);
            } else {
                this.msg_err = `NO se obtuvo el resultado esperado.\n\t\tInput: ${this.input}\n\t\tEsperaba: ${this.expected}\n\t\tRecibí: ${this.output.trim()}`;
                Utils.search(this.expected, this.output).should.be.equal(true);
            }
        }
    });

    it('', async function () { this.name = `5: Chequeando que el commando 'mooc_node-mod2_cmd_iterators.js' agrupe los argumentos ordenados`;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Test Exitoso";
            this.input = "two one two";
            this.expected = /one:\s?1.+?two:\s?2/s;
            this.output = "";
            [error_run, this.output] = await to(new Promise((resolve, reject) => {
                exec(`node ${path_assignment} ${this.input}`, (err, stdout) =>
                    err ? reject(err) : resolve(stdout))
            }));
            if (error_run) {
                this.msg_err = `Error al ejecutar 'mooc_node-mod2_cmd_iterators.js', Received: ${error_run}`;
                should.not.exist(error_run);
            } else {
                this.msg_err = `NO se obtuvo el resultado esperado.\n\t\tInput: ${this.input}\n\t\tEsperaba: ${this.expected}\n\t\tRecibí: ${this.output.trim()}`;
                Utils.search(this.expected, this.output).should.be.equal(true);
            }
        }
    });

    it('', async function () { this.name = `6: Chequeando que el commando 'mooc_node-mod2_cmd_iterators.js' suma los argumentos ordenados`;
        this.score = 2.25;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Test Exitoso";
            this.input = "one two one one three two";
            this.expected = /one:\s?3.+?three:\s?1.+?two:\s?2/s;
            this.output = "";
            [error_run, this.output] = await to(new Promise((resolve, reject) => {
                exec(`node ${path_assignment} ${this.input}`, (err, stdout) =>
                    err ? reject(err) : resolve(stdout))
            }));
            if (error_run) {
                this.msg_err = `Error al ejecutar 'mooc_node-mod2_cmd_iterators.js', Received: ${error_run}`;
                should.not.exist(error_run);
            } else {
                this.msg_err = `NO se obtuvo el resultado esperado.\n\t\tInput: ${this.input}\n\t\tExpected: ${this.expected}\n\t\tReceived: ${this.output.trim()}`;
                Utils.search(this.expected, this.output).should.be.equal(true);
            }
        }
    });
});