<template>
    <Popper class="dark" arrow hover :content="date">
        <a class="time-text">
            <span v-if="(timeString == 'now')">
                {{ timeString }}
            </span>
            <span v-else>
                {{ time }} {{ timeString }}
            </span>
            <div v-if="changed">
                Changed
            </div>
        </a>
    </Popper>
</template>
<script>
import Popper from "vue3-popper";

export default {
    components: {
        Popper
    },
    props: {
        date_create: { type: Number, default: null },
        changed: { type: Boolean, default: false }
    },
    data() {
        return {
            nowDate: new Date().getTime(),
            time: null,
            timeString: '',
            date: null,
        }
    },
    methods: {
        async dateMath() {
            const second = 1000;
            const minute = 1000 * 60;
            const hour = minute * 60;
            const day = hour * 24;
            const year = day * 365;
            this.time = Math.round((this.nowDate - this.date_create) / second);
            if (this.time >= 60) {
                this.time = Math.round((this.nowDate - this.date_create) / minute);
                if (this.time >= 60) {
                    this.time = Math.round((this.nowDate - this.date_create) / hour);
                    if (this.time >= 24) {
                        this.time = Math.round((this.nowDate - this.date_create) / day);
                        if (this.time >= 365) {
                            this.time = Math.round((this.nowDate - this.date_create) / year);
                            this.time > 1 ? this.timeString = "years ago" : this.timeString = "year ago";
                        } else this.time > 1 ? this.timeString = "days ago" : this.timeString = "day ago";
                    } else this.time > 1 ? this.timeString = "hours ago" : this.timeString = "hour ago";
                } else this.time > 1 ? this.timeString = "minutes ago" : this.timeString = "minute ago";
            } else this.timeString = "now"
        },
        async dateString() {
            const d = new Date(this.date_create);
            this.date = d.toLocaleString();
        }
    },
    created() {
        this.dateMath();
        this.dateString()
    }
}
</script>
<style scoped>
a:hover * {
    text-decoration: underline;
    color: black;
}

.time-text {
    font-size: 0.90em;
    font-style: italic;
}
</style>