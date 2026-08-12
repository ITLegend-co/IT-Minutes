/*
  MEETING RECORD LIBRARY

  This file is the main source of meeting data for the website.
  To add a new meeting:
  1. Copy one complete meeting object inside MEETING_RECORDS.
  2. Paste it at the TOP of the list.
  3. Give it a unique id and update its meeting details/tasks.
  4. Commit or upload this file to GitHub.

  The website automatically treats the newest date as the latest meeting.
*/

const MEETING_RECORDS = [
  {
    id: "2026-08-12-it-meeting",
    title: "I.T Meeting",
    preparedBy: "Prepared by: IT Legend",
    date: "2026-08-12",
    time: "",
    attendance: "",
    objective: "To review completed IT support work, current project progress, equipment servicing, system access issues, and follow-up monitoring requirements.",
    tasks: [
      {
        section: "IT Support",
        pic: "Eizzat",
        task: "Old CCTV Replacement",
        status: "Task Completed",
        description: "The original CCTV unit displayed flickering footage. Inspection found that stretched coaxial and power cables had placed excessive strain on the connections and caused gradual cable deterioration.\nThe technician first re-stripped and reconnected the existing cables, but the footage continued to flicker. The faulty CCTV unit was then replaced with a new unit, the cables were extended to prevent further strain, and the camera angle was restored to its previous position behind Vince's desk.",
        instruction: "The replacement CCTV is operating normally with no flickering. The technician's bill is expected to be issued the following week.",
        taskDate: "1 August 2026",
        deadline: "",
        extendedDeadline: "",
        dateComplete: "1 August 2026",
        comment: "",
        images: []
      },
      {
        section: "IT Support",
        pic: "Eizzat",
        task: "Computer Upgrade for Ferdinand",
        status: "Task Completed",
        description: "Ferdinand's computer was lagging during multitasking due to outdated hardware. The original setup used an Intel Pentium G645 processor, H61H2-AM3 motherboard, 8GB DDR3 RAM, Nvidia GT 710 GPU, 256GB SSD, 500GB HDD, and 200W power supply.\nData from the C drive was transferred to the D drive before formatting. The casing was cleaned, and spare components were installed: Intel Core i5-7400 processor, H110M-D motherboard, 8GB DDR4 RAM, and 600W power supply. The existing SSD, HDD, and GT 710 GPU were reused. New thermal paste was applied, Windows 10 Home and the required applications were installed, and a final stress test was completed.",
        instruction: "The upgraded computer passed the stress test and operated normally without premature shutdown. The highest recorded test temperature was 76°C, and the computer was handed back to Ferdinand.",
        taskDate: "4 August 2026",
        deadline: "",
        extendedDeadline: "",
        dateComplete: "4 August 2026",
        comment: "",
        images: []
      },
      {
        section: "IT Support",
        pic: "Eizzat",
        task: "Fuji Xerox DocuCentre S2520 Servicing",
        status: "Monitoring",
        description: "The Accounts Department reported a Drum End of Life message together with lines and toner spots on printed paper. Capital sent a technician to the KK office. The technician found toner-dust buildup inside the cartridge, cleaned and checked the compartment, and performed a test print. The Replace Drum message cleared, but marks remained on the paper.\nThe technician replaced the drum cartridge. After replacement, the lines and toner spots were significantly reduced.",
        instruction: "Continue monitoring the print quality for several print cycles, as the technician advised that the remaining marks should gradually disappear after the newly replaced drum settles.",
        taskDate: "3 August 2026",
        deadline: "",
        extendedDeadline: "",
        dateComplete: "",
        comment: "Requested by the Accounts Department. Servicing action was carried out on 4 August 2026.",
        images: []
      },
      {
        section: "IT Support",
        pic: "Eizzat",
        task: "Dispose Old Samsung SCX-4521F Printer",
        status: "Task Completed",
        description: "Approval was requested from Mr. Wilfred to dispose of the old Samsung SCX-4521F printer.",
        instruction: "The old printer was taken to the recycling centre for disposal.",
        taskDate: "5 August 2026",
        deadline: "",
        extendedDeadline: "",
        dateComplete: "12 August 2026",
        comment: "",
        images: []
      },
      {
        section: "IT Support",
        pic: "Eizzat",
        task: "Fae Unable to View HKD Meeting Recording in Teams",
        status: "Task Completed",
        description: "Fae could not view the latest HKD meeting recording. Remote access and the Microsoft Teams web version were tested, but the recording remained unavailable. Access was then checked using Aron's, Pam's, and the RSVN team accounts, with the same result.\nThe recording was found under the MT KP & OPS account. Access was granted through Pody's account, allowing Fae to view the recording successfully.",
        instruction: "Access to the required HKD meeting recording has been restored.",
        taskDate: "11 August 2026",
        deadline: "",
        extendedDeadline: "",
        dateComplete: "11 August 2026",
        comment: "",
        images: []
      },
      {
        section: "Project",
        pic: "Eizzat",
        task: "CCTV Installation at PH",
        status: "Still In Progress",
        description: "Finalization is ongoing before the CCTV installation at Pendant Hut. Reference: https://canva.link/1gy2hvt4ns58sjt",
        instruction: "Complete the final installation planning and confirm the setup before deployment to PH.",
        taskDate: "",
        deadline: "",
        extendedDeadline: "",
        dateComplete: "",
        comment: "",
        images: []
      },
      {
        section: "Project",
        pic: "Adly",
        task: "KP Internet Backup Solution Setup",
        status: "Monitoring",
        description: "U Mobile was selected as the KP backup internet solution because it supports fixed IP, unlimited internet, and operational systems requiring stable remote access. Initial testing at KK confirmed that the service was suitable for deployment.\nOn 7 August 2026, the U Mobile modem was installed and configured at KP, replacing the previous Celcom backup connection. Network access was configured and remote access to CCTV and the Anviz attendance system was verified through both Unifi and U Mobile.\nAverage KP speed results were 4.91 Mbps download and 9.54 Mbps upload for Unifi, and 5.01 Mbps download and 9.36 Mbps upload for U Mobile.",
        instruction: "Monitor the U Mobile connection for three months from 7 August 2026. After the monitoring period, evaluate whether it is stable enough to replace Unifi and whether the Unifi service can be terminated.",
        taskDate: "4 August 2026",
        deadline: "7 November 2026",
        extendedDeadline: "",
        dateComplete: "7 August 2026",
        comment: "Installation was completed between 1:00 PM and 3:15 PM. Internal modem access credentials are intentionally excluded from this public repository.",
        images: []
      }
    ]
  },
  {
  id: "2026-06-11-it-meeting",
  title: "I.T Meeting",
  preparedBy: "Prepared by: IT Legend",
  date: "2026-06-11",
  time: "9.30 AM",
  attendance: "Eizzat, Adly, Aron, Ros, Mdm I-Gek, Mr. Wilfred",
  objective: "To review IT support updates, project progress, pending issues, current instructions, deadlines, and next actions.",
  tasks: [
    {
      section: "IT Support",
      pic: "Eizzat",
      task: "Faulty UPS Battery at KP",
      status: "Task Completed",
      description: "Once the UPS arrived at KK, it was checked using a multimeter and confirmed that the battery was still holding a 12V charge.\nThe issue was found to be a faulty push button. After bypassing the wiring, the UPS was able to turn on without issue.\nA used light switch was used as a replacement because the electrical store did not have the specific push button brand available.\nWith Adly’s expertise, the wires were soldered and connected to the light switch.\nThe UPS was assembled again and tested successfully.",
      instruction: "Task completed.",
      taskDate: "",
      deadline: "",
      extendedDeadline: "",
      dateComplete: "",
      comment: ""
    },
    {
      section: "IT Support",
      pic: "Eizzat",
      task: "New Signature for Every MT Staff",
      status: "Still In Progress",
      description: "Adly forwarded an email regarding changes in staff signature and requested the replacement to the new signature format.\nProgress left: KP - MT-KP-01 Profile / Sipa's laptop. She is currently on leave and only she knows the computer password.",
      instruction: "Still in progress.",
      taskDate: "",
      deadline: "",
      extendedDeadline: "",
      dateComplete: "",
      comment: ""
    },
    {
      section: "IT Support",
      pic: "Eizzat",
      task: "Connection Problem at KP",
      status: "Still In Progress",
      description: "On 6 July 2026, TM was followed up again and a technician was scheduled to come at 3:30 PM. The technician arrived earlier than scheduled.\nBased on the technician’s explanation, he could no longer repatch the fibre as a temporary solution because the fibre signal was too high.\nOn 7 July 2026, the TM call centre was contacted again. They informed that the case had already been marked as priority, but the responsible maintenance team for the fibre box had not yet arrived.\nA rebate was also requested, and TM informed that it would be processed after the issue is resolved.",
      instruction: "Still in progress.",
      taskDate: "",
      deadline: "",
      extendedDeadline: "",
      dateComplete: "",
      comment: ""
    },
    {
      section: "Project",
      pic: "Eizzat",
      task: "CCTV Installation at PH",
      status: "Still In Progress",
      description: "Phase one of testing has been completed. Phase two testing is currently ongoing.",
      instruction: "Still in progress.",
      taskDate: "20 May 2026",
      deadline: "Before end of July",
      extendedDeadline: "",
      dateComplete: "",
      comment: ""
    },
    {
      section: "Project",
      pic: "Adly",
      task: "KP Internet Solution",
      status: "Still In Progress",
      description: "The last meeting discussed the documents needed to subscribe to the U Mobile provider and to check with Ros regarding the required documents.\nMr. Wilfred advised to compare the documents previously given to Celcom with the documents required by U Mobile.\nIf the required documents are the same as Celcom, the same documents can be given. If not, clarification should be requested from U Mobile on why the additional documents are needed.",
      instruction: "Still in progress.",
      taskDate: "",
      deadline: "Before end of July",
      extendedDeadline: "",
      dateComplete: "",
      comment: ""
    },
    {
      section: "Project",
      pic: "Adly",
      task: "Odoo Update",
      status: "Still In Progress",
      description: "Madam has already created the email for Housekeeping.\nMr. Wilfred suggested during the Accounts meeting to subscribe to two Odoo users at approximately USD 324 / RM1,340.15 annually. One account will be an admin account with full access and the other will have limited access.\nMr. Wilfred also suggested that Accounts should test the trial version first, then arrange another meeting with the Odoo agent to prepare further questions.",
      instruction: "Still in progress.",
      taskDate: "",
      deadline: "",
      extendedDeadline: "",
      dateComplete: "",
      comment: "Madam suggested Adly to create email accounts for all Housekeeping staff. Usernames should follow a standard format using first name plus the first letter of the surname, so each account can be clearly identified."
    },
    {
      section: "Project",
      pic: "Adly",
      task: "Microsoft Update",
      status: "Still In Progress",
      description: "A proposal was prepared to change the current domain from @mountaintorqvf.onmicrosoft.com to @mountaintorq.com.\nThe change is scheduled for 27 June 2026.\nAn announcement was made to all MT staff regarding the change.",
      instruction: "Still in progress.",
      taskDate: "",
      deadline: "",
      extendedDeadline: "",
      dateComplete: "",
      comment: ""
    },
    {
      section: "Project",
      pic: "Adly",
      task: "MOTOTRBO IT Side Update",
      status: "Still In Progress",
      description: "Testing was carried out using AnyDesk to monitor the MOTOTRBO system using tablet, phone and computer. The result was successful.\nAnyDesk is a remote screen-sharing tool similar to TeamViewer.\nWith AnyDesk, the Dispatcher team can continuously monitor what is happening.\nThe downside is that AnyDesk only supports one-way interaction in this setup.\nMr. Wilfred requested further checking on the AnyDesk Pro version to confirm whether communication back to PH is possible.",
      instruction: "Still in progress.",
      taskDate: "",
      deadline: "",
      extendedDeadline: "",
      dateComplete: "",
      comment: ""
    },
    {
      section: "Project",
      pic: "IT",
      task: "Inventory",
      status: "Still In Progress",
      description: "Inventory reference: https://mud-surf-22719163.figma.site/",
      instruction: "",
      taskDate: "",
      deadline: "",
      extendedDeadline: "",
      dateComplete: "",
      comment: "Madam asked not to include disposed and missing items. Madam suggested selling the barcode scanner internally first. If there is no buyer, proceed to list it on Carousell or Facebook Marketplace. Madam asked Adly to present the details to make the decision easier."
    }
  ]
}];

// Used as a safe fallback by the application.
const DEFAULT_MEETING = MEETING_RECORDS[0];
