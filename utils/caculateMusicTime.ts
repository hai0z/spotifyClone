const caculateTime = (duration: number, position: number) => {
    const currentSecond: string | number = `0${Math.floor(
        (position / 1000) % 60
    )}`.slice(-2);

    const currentMin = Math.floor((position / 1000 / 60) % 60);

    const totalSecond: string | number = `0${
        Math.floor(duration / 1000) % 60
    }`.slice(-2);

    const totalMin = `${Math.floor((duration / 1000 / 60) % 60)}`;

    const totalTime = `${totalMin}:${totalSecond}`;

    return {
        currentMin,
        currentSecond,
        totalTime,
    };
};
export default caculateTime;
