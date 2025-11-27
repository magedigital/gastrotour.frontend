export default class File {
    constructor({ input, checkDisabledDrag = () => false }) {
        this.input = input;
        this.checkDisabledDrag = checkDisabledDrag;
    }

    typesOfFiles = ['image/jpeg', 'image/png', 'image/jpg'];

    getSize(size) {
        if (size < 1024) {
            return `${size}б`;
        }

        if (size < 1024 * 1024) {
            return `${+(size / 1024).toFixed(1)}кб`;
        }

        if (size < 1024 * 1024 * 1024) {
            return `${+(size / (1024 * 1024)).toFixed(1)}мб`;
        }

        return `${+(size / (1024 * 1024 * 1024)).toFixed(1)}гб`;
    }

    uploadFiles({ target, names = [], getName, formData }) {
        const { files } = target;
        const currentTypes = this.typesOfFiles;

        return new Promise((resolve, reject) => {
            const getInfoFiles = [];

            if (Object.keys(files).find((key) => files[key].size > Math.pow(1024, 2) * 10) && 0) {
                reject();
            } else {
                Object.keys(files)
                    .filter((key) => currentTypes.indexOf(files[key].type) !== -1)
                    .forEach((key) => {
                        const file = files[key];
                        const fr = new FileReader();
                        const type = file.type;

                        getInfoFiles.push(
                            new Promise((resolveInfo) => {
                                fr.onload = (response) => {
                                    const { result: path } = response.target;
                                    const { name, size } = file;
                                    let keyName = names[key] || `file-${key}`;

                                    if (getName) {
                                        keyName = getName(key);
                                    }

                                    if (formData) {
                                        formData.set(keyName, file);
                                    }

                                    resolveInfo({
                                        path,
                                        name,
                                        size,
                                        key: keyName,
                                        type,
                                        object: file,
                                        isLocal: true,
                                        dateOfUpload: new Date(),
                                    });
                                };
                            }),
                        );

                        fr.readAsDataURL(file);
                    });

                Promise.all(getInfoFiles).then((resultFiles) => {
                    target.value = null;

                    if (this.input) {
                        this.input.value = null;
                    }

                    if (getInfoFiles.length) {
                        resolve({ resultFiles });
                    } else {
                        reject();
                    }
                });
            }
        });
    }

    counterDrag = 0;

    setDrag({ area, handlerOver, handlerLeave, handlerDrop }) {
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
            area.addEventListener(eventName, preventDefaults, false);
        });

        const isAdvancedUpload = (() => {
            const div = document.createElement('div');

            return (
                ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
                'FormData' in window &&
                'FileReader' in window
            );
        })();

        if (isAdvancedUpload) {
            area.addEventListener(
                'dragenter',
                () => {
                    if (!this.checkDisabledDrag()) {
                        this.counterDrag++;
                        handlerOver();
                    }
                },
                false,
            );
            area.addEventListener(
                'dragleave',
                () => {
                    if (!this.checkDisabledDrag()) {
                        this.counterDrag--;

                        if (this.counterDrag === 0) {
                            handlerLeave();
                            this.counterDrag = 0;
                        }
                    }
                },
                false,
            );
            area.addEventListener(
                'drop',
                (e) => {
                    if (!this.checkDisabledDrag()) {
                        this.counterDrag = 0;
                        handlerDrop(e.dataTransfer.files);
                    }
                },
                false,
            );
        }
    }
}
