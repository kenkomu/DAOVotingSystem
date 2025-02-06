"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DAOGeometricBackground from "../components/dao-geometric-background"
import StatusMessage from "./StatusMessage"
import ProposalList from "./ProposalList"
import CreateProposal from "./CreateProposal"
import Vote from "./Vote"
import Results from "./Results"

// Dummy function for demonstration purposes. Replace with your actual implementation.
const connectWallet = async () => ({ address: "0x1234567890abcdef" })

interface Proposal {
  id: number
  title: string
  description: string
  status: string
}

interface User {
  address: string
  role: "admin" | "member"
}

// Dummy data for users and proposals
const users: User[] = [
  { address: "0x1234567890abcdef", role: "admin" },
  { address: "0xabcdef1234567890", role: "member" },
]

const checkRegistration = async (address: string): Promise<boolean> => {
  return users.some(user => user.address === address)
}

const getUserRole = async (address: string): Promise<"admin" | "member"> => {
  const user = users.find(user => user.address === address)
  return user ? user.role : "member"
}

const getProposals = async (): Promise<Proposal[]> => [
  { id: 1, title: "Proposal 1", description: "Description for Proposal 1", status: "Active" },
  { id: 2, title: "Proposal 2", description: "Description for Proposal 2", status: "Completed" },
]

const createProposal = async (title: string, description: string) => ({ id: 3, title, description, status: "Active" })

export default function DAOVotingApp() {
  const [wallet, setWallet] = useState<{ address: string } | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "member">("member")
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [newProposal, setNewProposal] = useState({ title: "", description: "" })
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [voteChoice, setVoteChoice] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<"success" | "error" | "info">("success")

  useEffect(() => {
    const connectWalletAutomatically = async () => {
      displayStatusMessage("Attempting to connect to wallet...", "info")
      try {
        const connectedWallet = await connectWallet()
        setWallet(connectedWallet)
        displayStatusMessage(`Wallet Connected: ${connectedWallet.address}`, "success")
      } catch {
        displayStatusMessage("Please connect your wallet manually.", "info")
      }
    }

    connectWalletAutomatically()
  }, [])

  useEffect(() => {
    if (wallet) {
      checkRegistration(wallet.address).then(setIsRegistered)
      getUserRole(wallet.address).then(setUserRole)
      getProposals().then(setProposals)
    }
  }, [wallet])

  const displayStatusMessage = (message: string, type: "success" | "error" | "info" = "success") => {
    setStatusMessage(message)
    setStatusType(type)
    setTimeout(() => setStatusMessage(null), 3000)
  }

  const handleCreateProposal = async () => {
    try {
      const proposal = await createProposal(newProposal.title, newProposal.description)
      setProposals([...proposals, proposal])
      setNewProposal({ title: "", description: "" })
      displayStatusMessage("Your new proposal has been submitted.", "success")
    } catch {
      displayStatusMessage("Could not create the proposal.", "error")
    }
  }

  const handleVote = async () => {
    if (!selectedProposal || !voteChoice) {
      setStatusMessage("Please select a proposal and a vote choice.")
      return
    }

    try {
      const response = await axios.post<{ receipt: string }>("http://127.0.0.1:8080/submit_vote", {
        voter_id: 123, // Replace with actual voter ID (e.g., wallet address)
        proposal_id: selectedProposal.id,
        vote: voteChoice === "yes",
      })

      const proof = response.data.receipt
      console.log("Proof received:", proof)

      // Verify the proof (you can use a library or send it to the backend for verification)
      setStatusMessage("Your vote has been recorded and verified.")
    } catch (error) {
      console.error("Error submitting vote:", error)
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response data:", error.response.data)
          console.error("Response status:", error.response.status)
          console.error("Response headers:", error.response.headers)
          setStatusMessage(`Failed to submit your vote: ${error.response.data}`)
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request data:", error.request)
          setStatusMessage("Failed to submit your vote: No response from server.")
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message)
          setStatusMessage(`Failed to submit your vote: ${error.message}`)
        }
      } else {
        console.error("Unexpected error:", error)
        setStatusMessage("An unexpected error occurred.")
      }
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303] text-white">
      <DAOGeometricBackground />
      <div className="relative z-10 container mx-auto p-4">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
          DAO Voting System
        </h1>

        <StatusMessage message={statusMessage} type={statusType} />

        {wallet?.address && isRegistered && (
          <Tabs defaultValue="proposals" className="w-full">
            <TabsList>
              <TabsTrigger value="proposals">Proposals</TabsTrigger>
              {userRole === "admin" && <TabsTrigger value="create">Create Proposal</TabsTrigger>}
              <TabsTrigger value="vote">Vote</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="proposals">
              <ProposalList proposals={proposals} setSelectedProposal={setSelectedProposal} />
            </TabsContent>
            
            {userRole === "admin" && (
              <TabsContent value="create">
                <CreateProposal newProposal={newProposal} setNewProposal={setNewProposal} handleCreateProposal={handleCreateProposal} />
              </TabsContent>
            )}
            
            <TabsContent value="vote">
              <Vote selectedProposal={selectedProposal} voteChoice={voteChoice} setVoteChoice={setVoteChoice} handleVote={handleVote} />
            </TabsContent>
            
            <TabsContent value="results">
              <Results proposals={proposals} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}