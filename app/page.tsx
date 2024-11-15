"use client";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { getAddress } from "../get.address";

type Address = {
  cep: string;
  id: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  createdAt: Date;
};

const initialCopyAddress: Address[] = [];

function formatDate(date: Date) {
  const result = formatDistanceToNow(new Date(date), {
    includeSeconds: true,
    locale: enUS,
  });
  return result;
}

export default function Cep() {
  const [address, setAddress] = useState<Address | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyAddress, setCopyAddress] = useState<Address[]>(initialCopyAddress);

  async function HandleGetAddress() {
    if (inputValue.length !== 8 || isNaN(Number(inputValue))) {
      setError("Invalid ZIP code. Please ensure it's correct.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await getAddress(inputValue);

      if (result && result.logradouro) {
        setAddress(result.logradouro);
        console.log(result);

        const newAddress: Address = {
          id: uuidv4(),
          createdAt: new Date(),
          ...result,
        };

        setCopyAddress([newAddress, ...copyAddress]);
      } else {
        setError("ZIP code not found in the database.");
      }
    } catch (error) {
      setError("Error fetching the ZIP code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteAddress(id: string) {
    setCopyAddress(copyAddress.filter((copyAddress) => copyAddress.id !== id));
  }

  return (
    <div>
      <div className="py-5 text-4xl px-5 font-bold">
        <h2>Search by ZIP Code</h2>
      </div>

      <div className="flex flex-row gap-5 px-7 py-5">
        <label className="self-center">Address</label>
        <input
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Enter ZIP code here"
          className="border rounded-lg text-black px-2 py-2"
        />
        <button
          disabled={inputValue === ""}
          onClick={HandleGetAddress}
          className={`${
            loading && "opacity-30"
          } w-fit px-5 py-1 bg-blue-700 text-white rounded-xl`}
        >
          {loading ? "Loading..." : "Add Address"}
        </button>
      </div>

      {error && <div className="text-center py-5 text-red-500">{error}</div>}

      {copyAddress.length > 0 ? (
        <div className="px-5 py-5 flex justify-center">
          <table className="bg-gradient-to-r from-blue-500 to-blue-200 text-black font-bold shadow-md text-center">
            <thead>
              <tr>
                <th className="px-5 py-5">ZIP Code</th>
                <th className="px-5 py-5">Street</th>
                <th className="px-5 py-5">Neighborhood</th>
                <th className="px-5 py-5">City</th>
                <th className="px-5 py-5">State</th>
                <th className="px-5 py-5">Region</th>
                <th className="px-5 py-5">Queried At</th>
                <th className="px-5 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm text-center font-normal">
              {copyAddress.map((copyAddress) => (
                <tr
                  key={copyAddress.id}
                  className="odd:bg-gray-100 even:bg-gray-200 border-b border-gray-300"
                >
                  <td className="px-5 py-5">{copyAddress.cep}</td>
                  <td className="px-5 py-5">{copyAddress.logradouro}</td>
                  <td className="px-5 py-5">{copyAddress.bairro}</td>
                  <td className="px-5 py-5">{copyAddress.localidade}</td>
                  <td className="px-5 py-5">{copyAddress.estado}</td>
                  <td className="px-5 py-5">{copyAddress.regiao}</td>
                  <td className="px-5 py-5">
                    {formatDate(copyAddress.createdAt)}
                  </td>
                  <td className="px-5 py-5">
                    <button
                      onClick={() => handleDeleteAddress(copyAddress.id)}
                      className="text-white px-2 py-2 rounded"
                    >
                      <MdDelete size={15} color="red" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5 text-gray-500">
          No addresses added!
        </div>
      )}
      <footer className="fixed bottom-0 left-0 w-full py-5 text-center text-gray-500">
        Developed by{" "}
        <a
          href="https://www.linkedin.com/in/izabellealvess/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:underline"
        >
          Izabelle Alves
        </a>
      </footer>
    </div>
  );
}
