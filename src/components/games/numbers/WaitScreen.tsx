
interface WaitScreenProps {}

const WaitScreen = ({}: WaitScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-6">Please wait...</h2>
      <p className="text-muted-foreground">Keep the number sequence in your memory</p>
    </div>
  );
};

export default WaitScreen;
