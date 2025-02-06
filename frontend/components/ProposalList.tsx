import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface Proposal {
  id: number
  title: string
  description: string
  status: string
}

interface ProposalListProps {
  proposals: Proposal[]
  setSelectedProposal: (proposal: Proposal) => void
}

export default function ProposalList({ proposals, setSelectedProposal }: ProposalListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Proposals</CardTitle>
        <CardDescription>View and select proposals for voting</CardDescription>
      </CardHeader>
      <CardContent>
        {proposals.map(proposal => (
          <Button
            key={proposal.id}
            variant="outline"
            className="w-full mb-2 justify-start"
            onClick={() => setSelectedProposal(proposal)}
          >
            <FileText className="mr-2 h-4 w-4" />
            {proposal.title}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}