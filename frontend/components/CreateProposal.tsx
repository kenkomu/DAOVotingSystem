import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateProposalProps {
  newProposal: { title: string, description: string }
  setNewProposal: (proposal: { title: string, description: string }) => void
  handleCreateProposal: () => void
}

export default function CreateProposal({ newProposal, setNewProposal, handleCreateProposal }: CreateProposalProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Proposal</CardTitle>
        <CardDescription>Submit a new proposal for DAO voting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newProposal.title}
              onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newProposal.description}
              onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateProposal}>Create Proposal</Button>
      </CardFooter>
    </Card>
  )
}