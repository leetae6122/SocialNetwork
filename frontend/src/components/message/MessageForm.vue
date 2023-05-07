<template>
    <div class="d-flex my-1">
        <textarea name="inputmessage" @keyup.enter="submitMessage" class="form-control my-auto" rows="1"
            placeholder="Write a message..."></textarea>
        {{ textAreaAutoResize }}
    </div>
</template>
<script>

export default {
    emits: ["submit:message"],
    computed: {
        textAreaAutoResize() {
            const txHeight = 16;
            const tx = document.getElementsByName('inputmessage');
            for (let i = 0; i < tx.length; i++) {
                if (tx[i].value == '') {
                    tx[i].setAttribute("style", "height:" + txHeight + "px;overflow-y:hidden;");
                } else {
                    tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
                }
                tx[i].addEventListener("keyup", (e) => {
                    if (e.key === 'Enter') {
                        tx[i].style.height = '50px';
                        tx[i].value = '';
                    }
                }, false);
                tx[i].addEventListener("input", () => {
                    tx[i].style.height = 'auto';
                    tx[i].style.height = (tx[i].scrollHeight) + "px";
                }, false);
            }

        }
    },
    methods: {
        submitMessage(e) {
            const text = (e.target.value).trim();
            this.$emit("submit:message", text);
            (e.target.value) = '';
        },
    },
}   
</script>

<style scoped>
textarea {
    width: 100%;
    box-sizing: border-box;
    border-radius: 18px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    resize: none;
}
</style>