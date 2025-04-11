(function () {
    // Define CyberTerminal class
    function CyberTerminal(options) {
        // Default options
        this.options = {
            containerId: 'terminal-container',
            pageBackground: '#000',
            containerBackground: 'transparent',
            terminalBackground: '#000',
            promptColor: '#93e9be',
            textColor: '#ccc',
            cursorColor: '#93e9be',
            borderColor: '#800080',
            glowColor: '#80008050',
            terminalWidth: '800px',
            terminalHeight: '400px',
            typingSpeed: 100,
            outputDelay: 500,
            resetDelay: 1000
        };

        // Merge user options with defaults
        Object.assign(this.options, options || {});

        // Commands and outputs
        this.commands = [
            {
                input: 'id',
                output: 'uid=1000(user) gid=1000(user) groups=1000(user),4(adm),24(cdrom),27(sudo)'
            },
            {
                input: 'sudo id',
                output: 'uid=0(root) gid=0(root) groups=0(root)'
            }
        ];

        this.commandIndex = 0;
        this.state = 'typing';
        this.currentLine = null;

        // Initialize
        this.init();
    }

    CyberTerminal.prototype.init = function () {
        // Get container
        this.container = document.getElementById(this.options.containerId);
        if (!this.container) {
            console.error(`Container with ID "${this.options.containerId}" not found.`);
            return;
        }

        // Create terminal
        this.terminal = document.createElement('div');
        this.terminal.id = 'terminal';
        this.container.appendChild(this.terminal); // Fixed: Removed invalid 'podat' call

        // Apply styles
        this.applyStyles();

        // Start animation
        this.runTerminal();
    };

    CyberTerminal.prototype.applyStyles = function () {
        // CSS-in-JS styles
        const styles = {
            body: {
                margin: '0',
                height: '100vh',
                backgroundColor: this.options.pageBackground
            },
            container: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: this.options.containerBackground,
                margin: 0,
                overflow: 'hidden'
            },
            terminal: {
                width: this.options.terminalWidth,
                height: this.options.terminalHeight,
                backgroundColor: this.options.terminalBackground,
                border: `2px solid ${this.options.borderColor}`,
                borderRadius: '8px',
                padding: '20px',
                fontFamily: '"JetBrains Mono", "Courier New", monospace',
                fontSize: '16px',
                color: this.options.textColor,
                overflowY: 'auto',
                boxShadow: `0 0 20px ${this.options.glowColor}`,
                position: 'relative'
            },
            prompt: {
                color: this.options.promptColor,
                marginRight: '8px'
            },
            cursor: {
                display: 'inline-block',
                width: '8px',
                height: '16px',
                backgroundColor: this.options.cursorColor,
                verticalAlign: 'middle',
                animation: 'blink 1s step-end infinite'
            },
            command: {
                color: this.options.textColor
            },
            output: {
                color: this.options.textColor,
                marginTop: '8px',
                opacity: 0,
                animation: 'fadeIn 0.5s forwards'
            },
            line: {
                margin: '4px 0',
                whiteSpace: 'pre-wrap'
            }
        };

        // Apply styles
        Object.assign(document.body.style, styles.body);
        Object.assign(this.container.style, styles.container);
        Object.assign(this.terminal.style, styles.terminal);

        // Inject keyframes
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes blink {
                50% { opacity: 0; }
            }
            @keyframes fadeIn {
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(styleSheet);
    };

    CyberTerminal.prototype.typeCommand = function (text, callback) {
        const line = document.createElement('div');
        Object.assign(line.style, {
            margin: '4px 0',
            whiteSpace: 'pre-wrap'
        });
        const prompt = document.createElement('span');
        prompt.textContent = '$ ';
        Object.assign(prompt.style, {
            color: this.options.promptColor,
            marginRight: '8px'
        });
        const commandSpan = document.createElement('span');
        Object.assign(commandSpan.style, {
            color: this.options.textColor
        });
        const cursor = document.createElement('span');
        Object.assign(cursor.style, {
            display: 'inline-block',
            width: '8px',
            height: '16px',
            backgroundColor: this.options.cursorColor,
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite'
        });
        line.appendChild(prompt);
        line.appendChild(commandSpan);
        line.appendChild(cursor);
        this.terminal.appendChild(line);
        this.currentLine = line;

        let i = 0;
        const type = () => {
            if (i <= text.length) {
                commandSpan.textContent = text.slice(0, i);
                i++;
                setTimeout(type, this.options.typingSpeed);
            } else {
                cursor.remove();
                callback();
            }
        };
        type();
    };

    CyberTerminal.prototype.showOutput = function (text, callback) {
        const output = document.createElement('div');
        output.textContent = text;
        Object.assign(output.style, {
            color: this.options.textColor,
            marginTop: '8px',
            opacity: 0,
            animation: 'fadeIn 0.5s forwards'
        });
        this.terminal.appendChild(output);
        setTimeout(callback, this.options.outputDelay);
    };

    CyberTerminal.prototype.fadeOut = function (callback) {
        this.terminal.style.transition = 'opacity 0.5s';
        this.terminal.style.opacity = '0';
        setTimeout(() => {
            this.terminal.style.opacity = '1';
            callback();
        }, 500);
    };

    CyberTerminal.prototype.runTerminal = function () {
        const loop = () => {
            if (this.commandIndex >= this.commands.length) {
                this.fadeOut(() => {
                    this.terminal.innerHTML = '';
                    this.commandIndex = 0;
                    setTimeout(loop, this.options.resetDelay);
                });
                return;
            }

            const cmd = this.commands[this.commandIndex];
            this.typeCommand(cmd.input, () => {
                this.showOutput(cmd.output, () => {
                    this.commandIndex++;
                    setTimeout(loop, this.options.outputDelay);
                });
            });
        };
        loop();
    };

    // Expose CyberTerminal globally
    window.CyberTerminal = CyberTerminal;
})();