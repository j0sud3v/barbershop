import Input from "../inputPassword/Input";

type CofirmCodeProps = {
  code: string;
  setCode: (value: string) => void;
  onVerify: () => void;
  loading: boolean;
  message: string;
  messageTone?: "success" | "error";
};

const CofirmCode = ({
  code,
  setCode,
  onVerify,
  loading,
  message,
  messageTone = "success",
}: CofirmCodeProps) => {
  return (
    <div className="grid gap-3">
      <Input
        placeholder="Ingresa el código"
        type="text"
        width="400"
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        type="button"
        onClick={onVerify}
        disabled={loading || !code.trim()}
        className="bg-[#2b2b2b] py-2 text-lg cursor-pointer hover:bg-[#2b2b2b]/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Verificando..." : "Verificar código"}
      </button>

      {message && (
        <span
          className={
            messageTone === "error"
              ? "text-red-400 text-sm text-center"
              : "text-green-400 text-sm text-center"
          }
        >
          {message}
        </span>
      )}
    </div>
  );
};

export default CofirmCode;
