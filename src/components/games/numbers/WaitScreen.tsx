
interface WaitScreenProps {}

const WaitScreen = ({}: WaitScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-6">Wait...</h2>
      <p className="text-muted-foreground">Remember the numbers</p>
    </div>
  );
};

export default WaitScreen;
