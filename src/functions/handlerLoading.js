export default function handlerLoading(loadingKey, otherProps) {
    return new Promise((resolve) => {
        this.setState({ loadingKey, ...otherProps }, resolve);
    });
}
